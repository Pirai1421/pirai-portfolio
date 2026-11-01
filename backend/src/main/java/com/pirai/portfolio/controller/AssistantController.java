package com.pirai.portfolio.controller;

import com.pirai.portfolio.model.AssistantStatusResponse;
import com.pirai.portfolio.model.ChatRequest;
import com.pirai.portfolio.model.ChatResponse;
import com.pirai.portfolio.service.AssistantService;
import com.pirai.portfolio.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;
    private final RateLimiterService rateLimiterService;

    public AssistantController(AssistantService assistantService, RateLimiterService rateLimiterService) {
        this.assistantService = assistantService;
        this.rateLimiterService = rateLimiterService;
    }

    @GetMapping("/status")
    public ResponseEntity<AssistantStatusResponse> getStatus() {
        boolean live = assistantService.isLiveAiConfigured();
        AssistantStatusResponse response = new AssistantStatusResponse(
                "ONLINE",
                live ? "LIVE_AI" : "VERIFIED_KNOWLEDGE_BASE",
                live ? assistantService.getAiModel() : "Curated Portfolio Guardrails Engine",
                live,
                "Hi! I'm the AI assistant for Pirai Soodan G.'s portfolio. Ask me about his Java backend experience, Spring Boot, microservices, projects, technical skills, or professional background."
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request,
            HttpServletRequest servletRequest
    ) {
        String clientIp = extractClientIp(servletRequest);
        if (!rateLimiterService.tryAcquire(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(ChatResponse.of(
                            "Too many requests sent. Please pause a moment before asking another question.",
                            "RATE_LIMITED",
                            true,
                            0
                    ));
        }

        ChatResponse response = assistantService.processChat(request.message());
        return ResponseEntity.ok(response);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }
}
