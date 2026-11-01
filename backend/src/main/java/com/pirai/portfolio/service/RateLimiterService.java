package com.pirai.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {

    private final int maxRequestsPerMinute;
    private final Map<String, WindowCounter> requestCounts = new ConcurrentHashMap<>();

    public RateLimiterService(@Value("${portfolio.rate-limit.requests-per-minute:30}") int maxRequestsPerMinute) {
        this.maxRequestsPerMinute = maxRequestsPerMinute;
    }

    public boolean tryAcquire(String clientIp) {
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = "anonymous";
        }

        long currentMinute = Instant.now().getEpochSecond() / 60;
        WindowCounter counter = requestCounts.compute(clientIp, (key, existing) -> {
            if (existing == null || existing.minute() != currentMinute) {
                return new WindowCounter(currentMinute, new AtomicInteger(1));
            }
            existing.count().incrementAndGet();
            return existing;
        });

        // Periodic cleanup
        if (requestCounts.size() > 5000) {
            requestCounts.entrySet().removeIf(e -> e.getValue().minute() < currentMinute);
        }

        return counter.count().get() <= maxRequestsPerMinute;
    }

    private record WindowCounter(long minute, AtomicInteger count) {}
}
