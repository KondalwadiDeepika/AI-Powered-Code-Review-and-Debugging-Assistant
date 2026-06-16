package com.example.smart_code_reviewer.controller;

import com.example.smart_code_reviewer.audit.AuditLog;
import com.example.smart_code_reviewer.audit.AuditService;
import com.example.smart_code_reviewer.dto.AdminDTOs.*;
import com.example.smart_code_reviewer.model.User;
import com.example.smart_code_reviewer.service.AdminService;
import com.example.smart_code_reviewer.service.RateLimiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuditService auditService;
    private final RateLimiterService rateLimiterService;

    @GetMapping("/users")
    public ResponseEntity<Page<UserSummaryResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDetailResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateRoleRequest request) {
        adminService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok("Role updated successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<SystemStatsResponse> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<Object[]>> getAuditSummary() {
        return ResponseEntity.ok(auditService.getActionSummary());
    }

    @GetMapping("/audit-logs/top-users")
    public ResponseEntity<List<Object[]>> getTopUsers() {
        return ResponseEntity.ok(auditService.getTopActiveUsers());
    }

    @PostMapping("/rate-limit/{username}/reset")
    public ResponseEntity<String> resetRateLimit(@PathVariable String username) {
        rateLimiterService.resetForUser(username);
        return ResponseEntity.ok("Rate limit reset for " + username);
    }

    @GetMapping("/reviews/all")
    public ResponseEntity<List<Map<String, Object>>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(adminService.getAllReviewsSummary(page, size));
    }
}
