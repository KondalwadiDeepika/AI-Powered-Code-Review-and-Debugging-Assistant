package com.example.smart_code_reviewer.dto;

import com.example.smart_code_reviewer.model.User;
import lombok.Data;
import java.time.LocalDateTime;

public class AdminDTOs {

    @Data
    public static class UserSummaryResponse {
        private Long id;
        private String username;
        private String email;
        private String role;
        private LocalDateTime createdAt;
        private long totalReviews;
    }

    @Data
    public static class UserDetailResponse {
        private Long id;
        private String username;
        private String email;
        private String role;
        private LocalDateTime createdAt;
        private long totalReviews;
        private Double avgQualityScore;
        private Double avgSecurityScore;
        private Double avgPerformanceScore;
    }

    @Data
    public static class UpdateRoleRequest {
        private User.Role role;
    }

    @Data
    public static class SystemStatsResponse {
        private long totalUsers;
        private long totalReviews;
        private long reviewsToday;
        private long reviewsThisWeek;
        private Double avgQualityScore;
        private Double avgSecurityScore;
        private Double avgPerformanceScore;
        private long criticalSeverityCount;
        private long highSeverityCount;
    }
}
