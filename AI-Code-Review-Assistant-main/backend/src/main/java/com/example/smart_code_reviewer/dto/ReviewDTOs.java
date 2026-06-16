package com.example.smart_code_reviewer.dto;

import com.example.smart_code_reviewer.model.Review;
import lombok.Data;
import java.time.LocalDateTime;

public class ReviewDTOs {

    @Data
    public static class ReviewRequest {
        private String code;
    }

    @Data
    public static class ReviewResponse {
        private Long id;
        private String languageDetected;
        private String reviewResult;
        private Review.SeverityLevel severityLevel;
        private int qualityScore;
        private int securityScore;
        private int performanceScore;
        private LocalDateTime createdAt;

        public static ReviewResponse from(Review r) {
            ReviewResponse dto = new ReviewResponse();
            dto.id = r.getId();
            dto.languageDetected = r.getLanguageDetected();
            dto.reviewResult = r.getReviewResult();
            dto.severityLevel = r.getSeverityLevel();
            dto.qualityScore = r.getQualityScore() != null ? r.getQualityScore() : 0;
            dto.securityScore = r.getSecurityScore() != null ? r.getSecurityScore() : 0;
            dto.performanceScore = r.getPerformanceScore() != null ? r.getPerformanceScore() : 0;
            dto.createdAt = r.getCreatedAt();
            return dto;
        }
    }

    @Data
    public static class AnalyticsResponse {
        private long totalReviews;
        private Object languageBreakdown;
        private Object severityBreakdown;
    }
}
