package com.example.smart_code_reviewer.service;

import com.example.smart_code_reviewer.exception.RateLimitExceededException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Token-bucket rate limiter: tracks per-user request timestamps
 * within a rolling time window and rejects if the limit is exceeded.
 */
@Service
@Slf4j
public class RateLimiterService {

    @Value("${app.rate-limit.max-requests:10}")
    private int maxRequests;

    @Value("${app.rate-limit.window-seconds:60}")
    private long windowSeconds;

    private final Map<String, Deque<Instant>> requestTimestamps = new ConcurrentHashMap<>();

    public void checkRateLimit(String username) {
        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(windowSeconds);

        requestTimestamps.compute(username, (key, deque) -> {
            if (deque == null) deque = new ArrayDeque<>();
            // Evict timestamps outside the window
            while (!deque.isEmpty() && deque.peekFirst().isBefore(windowStart)) {
                deque.pollFirst();
            }
            if (deque.size() >= maxRequests) {
                log.warn("Rate limit exceeded for user: {}", username);
                throw new RateLimitExceededException(
                    "Rate limit exceeded: maximum " + maxRequests +
                    " requests per " + windowSeconds + " seconds"
                );
            }
            deque.addLast(now);
            return deque;
        });
    }

    public int getRemainingRequests(String username) {
        Instant windowStart = Instant.now().minusSeconds(windowSeconds);
        Deque<Instant> deque = requestTimestamps.getOrDefault(username, new ArrayDeque<>());
        long used = deque.stream().filter(t -> t.isAfter(windowStart)).count();
        return Math.max(0, maxRequests - (int) used);
    }

    public void resetForUser(String username) {
        requestTimestamps.remove(username);
        log.info("Rate limit reset for user: {}", username);
    }
}
