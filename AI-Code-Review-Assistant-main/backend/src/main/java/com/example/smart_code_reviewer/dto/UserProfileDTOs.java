package com.example.smart_code_reviewer.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

public class UserProfileDTOs {

    @Data
    public static class UserProfileResponse {
        private Long id;
        private String username;
        private String email;
        private String role;
        private LocalDateTime createdAt;
        private long totalReviews;
        private long reviewsThisWeek;
        private double avgQualityScore;
        private double avgSecurityScore;
    }

    @Data
    public static class ChangePasswordRequest {
        @NotBlank
        private String currentPassword;

        @NotBlank
        @Size(min = 6, max = 40)
        private String newPassword;
    }

    @Data
    public static class UpdateEmailRequest {
        @NotBlank
        @Email
        private String email;
    }
}
