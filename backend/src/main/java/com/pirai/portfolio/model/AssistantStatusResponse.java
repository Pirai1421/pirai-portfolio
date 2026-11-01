package com.pirai.portfolio.model;

public record AssistantStatusResponse(
        String status,
        String mode,
        String model,
        boolean liveAiAvailable,
        String greeting
) {}
