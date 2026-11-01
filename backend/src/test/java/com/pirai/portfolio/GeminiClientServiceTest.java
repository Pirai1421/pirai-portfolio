package com.pirai.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pirai.portfolio.service.GeminiClientService;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class GeminiClientServiceTest {

    @Test
    void treatsEmptyAndPlaceholderKeysAsNotConfigured() {
        assertFalse(createClient("").isConfigured());
        assertFalse(createClient("placeholder").isConfigured());
        assertFalse(createClient("your_google_gemini_api_key_here").isConfigured());
    }

    @Test
    void treatsSuppliedApiKeyAsConfigured() {
        assertTrue(createClient("configured-api-key").isConfigured());
    }

    @Test
    void retriesTransientServiceUnavailableResponse() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", 0), 0);
        AtomicInteger requestCount = new AtomicInteger();
        server.createContext("/v1beta/models/gemini-3.8-flash:generateContent", exchange -> {
            byte[] responseBody;
            int statusCode;
            if (requestCount.incrementAndGet() == 1) {
                responseBody = """
                        {"error":{"message":"Temporarily unavailable"}}
                        """.getBytes(StandardCharsets.UTF_8);
                statusCode = 503;
            } else {
                responseBody = """
                        {"candidates":[{"content":{"parts":[{"text":"Retry succeeded"}]}}]}
                        """.getBytes(StandardCharsets.UTF_8);
                statusCode = 200;
            }
            exchange.sendResponseHeaders(statusCode, responseBody.length);
            try (var response = exchange.getResponseBody()) {
                response.write(responseBody);
            }
        });
        server.start();

        try {
            GeminiClientService client = new GeminiClientService(
                    "configured-api-key",
                    "http://localhost:" + server.getAddress().getPort() + "/v1beta",
                    "gemini-3.8-flash",
                    5,
                    new ObjectMapper()
            );

            assertEquals("Retry succeeded", client.generateCompletion("system", "context", "question"));
            assertEquals(2, requestCount.get());
        } finally {
            server.stop(0);
        }
    }

    private GeminiClientService createClient(String apiKey) {
        return new GeminiClientService(
                apiKey,
                "https://generativelanguage.googleapis.com/v1beta",
                "gemini-3.8-flash",
                15,
                new ObjectMapper()
        );
    }
}
