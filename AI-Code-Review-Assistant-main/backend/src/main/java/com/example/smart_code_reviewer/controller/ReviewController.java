package com.example.smart_code_reviewer.controller;

import com.example.smart_code_reviewer.audit.AuditLog;
import com.example.smart_code_reviewer.audit.AuditService;
import com.example.smart_code_reviewer.dto.ReviewDTOs.*;
import com.example.smart_code_reviewer.model.Review;
import com.example.smart_code_reviewer.service.CodeReviewService;
import com.example.smart_code_reviewer.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final CodeReviewService reviewService;
    private final RateLimiterService rateLimiterService;
    private final AuditService auditService;

    @PostMapping
    public ResponseEntity<ReviewResponse> reviewCode(
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest httpRequest) {

        String username = userDetails.getUsername();
        rateLimiterService.checkRateLimit(username);

        Review review = reviewService.reviewCode(request.getCode());

        auditService.log(username, AuditLog.AuditAction.CODE_REVIEW,
                "Review", review.getId(),
                "Language: " + review.getLanguageDetected() + ", Severity: " + review.getSeverityLevel(),
                httpRequest.getRemoteAddr());

        return ResponseEntity.ok(ReviewResponse.from(review));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ReviewResponse>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        auditService.log(userDetails.getUsername(), AuditLog.AuditAction.VIEW_HISTORY, "history viewed");
        List<ReviewResponse> history = reviewService.getUserHistory()
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {
        auditService.log(userDetails.getUsername(), AuditLog.AuditAction.VIEW_ANALYTICS, "analytics viewed");

        List<Object[]> langStats = reviewService.getLanguageStats();
        List<Object[]> severityStats = reviewService.getSeverityStats();
        List<Object[]> langAggregate = reviewService.getLanguageAggregate();

        Map<String, Long> langMap = new LinkedHashMap<>();
        for (Object[] row : langStats) {
            langMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Long> sevMap = new LinkedHashMap<>();
        for (Object[] row : severityStats) {
            sevMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        // Per-language score averages
        List<Map<String, Object>> langScores = new ArrayList<>();
        for (Object[] row : langAggregate) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("language", row[0]);
            entry.put("avgQuality", row[1]);
            entry.put("avgSecurity", row[2]);
            entry.put("avgPerformance", row[3]);
            entry.put("count", row[4]);
            langScores.add(entry);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("languageBreakdown", langMap);
        result.put("severityBreakdown", sevMap);
        result.put("languageScores", langScores);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return reviewService.getReviewById(id, userDetails.getUsername())
                .map(r -> ResponseEntity.ok(ReviewResponse.from(r)))
                .orElse(ResponseEntity.notFound().build());
    }
}
