package com.pirai.portfolio.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        @Size(max = 120, message = "Email must not exceed 120 characters")
        String email,

        @NotBlank(message = "Subject is required")
        @Size(max = 150, message = "Subject must not exceed 150 characters")
        String subject,

        @NotBlank(message = "Message is required")
        @Size(max = 2000, message = "Message must not exceed 2000 characters")
        String message
) {}
