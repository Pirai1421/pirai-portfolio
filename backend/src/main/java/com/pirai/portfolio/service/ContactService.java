package com.pirai.portfolio.service;

import com.pirai.portfolio.model.ContactMessageRequest;
import com.pirai.portfolio.model.ContactMessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    public ContactMessageResponse processContactMessage(ContactMessageRequest request) {
        log.info("Received contact inquiry from name: {}, email: {}, subject: {}",
                request.name(), request.email(), request.subject());

        // In production, this can send an email via JavaMailSender or trigger a webhook.
        // For local development and demo, it returns a verified success confirmation.
        return new ContactMessageResponse(
                true,
                "Thank you, " + request.name() + "! Your message has been received. Pirai will get back to you shortly at " + request.email() + "."
        );
    }
}
