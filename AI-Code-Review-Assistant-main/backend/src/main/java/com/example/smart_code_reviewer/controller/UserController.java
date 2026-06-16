package com.example.smart_code_reviewer.controller;

import com.example.smart_code_reviewer.audit.AuditLog;
import com.example.smart_code_reviewer.audit.AuditService;
import com.example.smart_code_reviewer.dto.UserProfileDTOs.*;
import com.example.smart_code_reviewer.service.RateLimiterService;
import com.example.smart_code_reviewer.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;
    private final AuditService auditService;
    private final RateLimiterService rateLimiterService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        auditService.log(userDetails.getUsername(), AuditLog.AuditAction.VIEW_HISTORY, "profile viewed");
        return ResponseEntity.ok(userProfileService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userProfileService.changePassword(userDetails.getUsername(), request);
        auditService.log(userDetails.getUsername(), AuditLog.AuditAction.PASSWORD_CHANGE, "password changed");
        return ResponseEntity.ok("Password updated successfully");
    }

    @PutMapping("/email")
    public ResponseEntity<String> updateEmail(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateEmailRequest request) {
        userProfileService.updateEmail(userDetails.getUsername(), request.getEmail());
        return ResponseEntity.ok("Email updated successfully");
    }

    @GetMapping("/rate-limit/status")
    public ResponseEntity<Integer> getRateLimitStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rateLimiterService.getRemainingRequests(userDetails.getUsername()));
    }
}
