package com.pirai.portfolio.model;

public record ChatResponse(
        String answer,
        String mode, // "LIVE_AI" or "VERIFIED_KNOWLEDGE_BASE"
        boolean offTopic,
        long responseTimeMs
) {
    public static ChatResponse of(String answer, String mode, boolean offTopic, long responseTimeMs) {
        return new ChatResponse(answer, mode, offTopic, responseTimeMs);
    }
}
