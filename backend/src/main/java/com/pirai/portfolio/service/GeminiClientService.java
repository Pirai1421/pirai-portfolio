package com.pirai.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Service
public class GeminiClientService {

    private static final Logger log = LoggerFactory.getLogger(GeminiClientService.class);
    private static final int MAX_RETRIES = 2;
    private static final long RETRY_DELAY_MILLIS = 500;

    private final String apiKey;
    private final String baseUrl;
    private final String model;
    private final Duration timeout;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiClientService(
            @Value("${gemini.api-key:}") String apiKey,
            @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta}") String baseUrl,
            @Value("${gemini.model:gemini-3.8-flash}") String model,
            @Value("${gemini.timeout-seconds:15}") int timeoutSeconds,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.baseUrl = baseUrl != null && !baseUrl.isBlank() ? baseUrl.trim() : "https://generativelanguage.googleapis.com/v1beta";
        this.model = model != null && !model.isBlank() ? model.trim() : "gemini-3.8-flash";
        this.timeout = Duration.ofSeconds(Math.max(5, timeoutSeconds));
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(this.timeout)
                .build();
        this.objectMapper = objectMapper;
    }

    public boolean isConfigured() {
        return !apiKey.isBlank()
                && !apiKey.equalsIgnoreCase("placeholder")
                && !apiKey.toUpperCase(Locale.ROOT).startsWith("YOUR_");
    }

    public String getModel() {
        return model;
    }

    public String generateCompletion(String systemPrompt, String verifiedContext, String userMessage) {
        if (!isConfigured()) {
            throw new IllegalStateException("Google Gemini API key is not configured.");
        }

        try {
            ObjectNode root = objectMapper.createObjectNode();

            // 1. System Instruction
            ObjectNode systemInstructionNode = root.putObject("system_instruction");
            ArrayNode sysParts = systemInstructionNode.putArray("parts");
            ObjectNode sysPart = sysParts.addObject();
            sysPart.put("text", systemPrompt + "\n\n" + verifiedContext);

            // 2. User Content
            ArrayNode contents = root.putArray("contents");
            ObjectNode userContent = contents.addObject();
            userContent.put("role", "user");
            ArrayNode userParts = userContent.putArray("parts");
            ObjectNode userPart = userParts.addObject();
            userPart.put("text", userMessage);

            // 3. Generation Config
            ObjectNode generationConfig = root.putObject("generationConfig");
            generationConfig.put("temperature", 0.1);
            generationConfig.put("maxOutputTokens", 400);

            String requestBody = objectMapper.writeValueAsString(root);

            String encodedKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);
            String endpoint = String.format("%s/models/%s:generateContent?key=%s", baseUrl, model, encodedKey);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Content-Type", "application/json")
                    .timeout(timeout)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = sendWithRetry(request);

            if (response.statusCode() == 200) {
                JsonNode responseJson = objectMapper.readTree(response.body());
                JsonNode candidates = responseJson.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && !parts.isEmpty()) {
                        return parts.get(0).path("text").asText().trim();
                    }
                }
                throw new RuntimeException("Empty candidates or parts in Google Gemini API response");
            } else {
                log.warn("Google Gemini API returned HTTP {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Google Gemini API error: HTTP " + response.statusCode());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Gemini API request was interrupted", e);
            throw new RuntimeException("Gemini AI service call was interrupted.", e);
        } catch (Exception e) {
            log.error("Failed to query Google Gemini API: {}", e.getMessage());
            throw new RuntimeException("Gemini AI service call failed: " + e.getMessage(), e);
        }
    }

    private HttpResponse<String> sendWithRetry(HttpRequest request) throws Exception {
        for (int attempt = 0; ; attempt++) {
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );
            if (!isRetryableStatus(response.statusCode()) || attempt >= MAX_RETRIES) {
                return response;
            }

            long delayMillis = getRetryDelayMillis(response, attempt);
            log.warn(
                    "Gemini API returned transient HTTP {}; retrying attempt {}/{} after {} ms",
                    response.statusCode(),
                    attempt + 1,
                    MAX_RETRIES,
                    delayMillis
            );
            TimeUnit.MILLISECONDS.sleep(delayMillis);
        }
    }

    private boolean isRetryableStatus(int statusCode) {
        return statusCode == 429 || statusCode == 502 || statusCode == 503 || statusCode == 504;
    }

    private long getRetryDelayMillis(HttpResponse<?> response, int attempt) {
        return response.headers()
                .firstValue("Retry-After")
                .map(this::parseRetryAfterMillis)
                .orElse(RETRY_DELAY_MILLIS * (attempt + 1));
    }

    private long parseRetryAfterMillis(String retryAfter) {
        try {
            long seconds = Long.parseLong(retryAfter);
            return Math.min(TimeUnit.SECONDS.toMillis(seconds), TimeUnit.SECONDS.toMillis(3));
        } catch (NumberFormatException e) {
            return RETRY_DELAY_MILLIS;
        }
    }
}
