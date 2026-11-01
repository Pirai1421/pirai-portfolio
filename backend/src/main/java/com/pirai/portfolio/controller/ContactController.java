package com.pirai.portfolio.controller;

import com.pirai.portfolio.model.ContactMessageRequest;
import com.pirai.portfolio.model.ContactMessageResponse;
import com.pirai.portfolio.service.ContactService;
import com.pirai.portfolio.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;
    private final RateLimiterService rateLimiterService;

    public ContactController(ContactService contactService, RateLimiterService rateLimiterService) {
        this.contactService = contactService;
        this.rateLimiterService = rateLimiterService;
    }

    @PostMapping
    public ResponseEntity<ContactMessageResponse> submitContact(
            @Valid @RequestBody ContactMessageRequest request,
            HttpServletRequest servletRequest
    ) {
        String clientIp = servletRequest.getRemoteAddr();
        if (!rateLimiterService.tryAcquire(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ContactMessageResponse(false, "Rate limit reached. Please try again in a few minutes."));
        }

        ContactMessageResponse response = contactService.processContactMessage(request);
        return ResponseEntity.ok(response);
    }
}
