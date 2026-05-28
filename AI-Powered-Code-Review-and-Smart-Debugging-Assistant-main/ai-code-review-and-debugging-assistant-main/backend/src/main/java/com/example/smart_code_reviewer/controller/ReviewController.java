package com.example.smart_code_reviewer.controller;

import com.example.smart_code_reviewer.dto.ReviewDTOs.*;
import com.example.smart_code_reviewer.model.Review;
import com.example.smart_code_reviewer.service.CodeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final CodeReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> reviewCode(@RequestBody ReviewRequest request) {
        Review review = reviewService.reviewCode(request.getCode());
        return ResponseEntity.ok(ReviewResponse.from(review));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ReviewResponse>> getHistory() {
        List<ReviewResponse> history = reviewService.getUserHistory()
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<Object[]> langStats = reviewService.getLanguageStats();
        List<Object[]> severityStats = reviewService.getSeverityStats();

        Map<String, Long> langMap = new LinkedHashMap<>();
        for (Object[] row : langStats) {
            langMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Long> sevMap = new LinkedHashMap<>();
        for (Object[] row : severityStats) {
            sevMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("languageBreakdown", langMap);
        result.put("severityBreakdown", sevMap);
        return ResponseEntity.ok(result);
    }
}
