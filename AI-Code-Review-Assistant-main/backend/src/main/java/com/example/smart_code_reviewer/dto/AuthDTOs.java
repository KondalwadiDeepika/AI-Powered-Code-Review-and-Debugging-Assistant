package com.example.smart_code_reviewer.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

public class AuthDTOs {

    @Data
    public static class SignupRequest {
        @NotBlank
        @Size(min = 3, max = 20)
        private String username;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6, max = 40)
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        private String username;

        @NotBlank
        private String password;
    }

    @Data
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private String role;

        public JwtResponse(String token, Long id, String username, String email, String role) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }
    }
}
