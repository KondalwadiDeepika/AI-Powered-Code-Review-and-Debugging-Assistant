package com.example.smart_code_reviewer.service;

import com.example.smart_code_reviewer.dto.AdminDTOs.*;
import com.example.smart_code_reviewer.exception.ResourceNotFoundException;
import com.example.smart_code_reviewer.model.Review;
import com.example.smart_code_reviewer.model.User;
import com.example.smart_code_reviewer.repository.ReviewRepository;
import com.example.smart_code_reviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public Page<UserSummaryResponse> getAllUsers(int page, int size) {
        Page<User> users = userRepository.findAll(PageRequest.of(page, size));
        List<UserSummaryResponse> responses = users.getContent().stream().map(u -> {
            UserSummaryResponse r = new UserSummaryResponse();
            r.setId(u.getId());
            r.setUsername(u.getUsername());
            r.setEmail(u.getEmail());
            r.setRole(u.getRole().name());
            r.setCreatedAt(u.getCreatedAt());
            r.setTotalReviews(reviewRepository.countByUserId(u.getId()));
            return r;
        }).collect(Collectors.toList());
        return new PageImpl<>(responses, users.getPageable(), users.getTotalElements());
    }

    public UserDetailResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(id);

        UserDetailResponse r = new UserDetailResponse();
        r.setId(user.getId());
        r.setUsername(user.getUsername());
        r.setEmail(user.getEmail());
        r.setRole(user.getRole().name());
        r.setCreatedAt(user.getCreatedAt());
        r.setTotalReviews(reviews.size());
        r.setAvgQualityScore(reviews.stream()
                .mapToInt(rev -> rev.getQualityScore() != null ? rev.getQualityScore() : 0)
                .average().orElse(0));
        r.setAvgSecurityScore(reviews.stream()
                .mapToInt(rev -> rev.getSecurityScore() != null ? rev.getSecurityScore() : 0)
                .average().orElse(0));
        r.setAvgPerformanceScore(reviews.stream()
                .mapToInt(rev -> rev.getPerformanceScore() != null ? rev.getPerformanceScore() : 0)
                .average().orElse(0));
        return r;
    }

    @Transactional
    public void updateUserRole(Long id, User.Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setRole(newRole);
        userRepository.save(user);
        log.info("Updated role for user {} to {}", user.getUsername(), newRole);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        userRepository.delete(user);
        log.info("Deleted user: {}", user.getUsername());
    }

    public SystemStatsResponse getSystemStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusDays(7);

        SystemStatsResponse stats = new SystemStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalReviews(reviewRepository.count());
        stats.setReviewsToday(reviewRepository.countByCreatedAtAfter(startOfDay));
        stats.setReviewsThisWeek(reviewRepository.countByCreatedAtAfter(startOfWeek));
        stats.setAvgQualityScore(reviewRepository.averageQualityScore());
        stats.setAvgSecurityScore(reviewRepository.averageSecurityScore());
        stats.setAvgPerformanceScore(reviewRepository.averagePerformanceScore());
        stats.setCriticalSeverityCount(reviewRepository.countBySeverityLevel(Review.SeverityLevel.CRITICAL));
        stats.setHighSeverityCount(reviewRepository.countBySeverityLevel(Review.SeverityLevel.HIGH));
        return stats;
    }

    public List<Map<String, Object>> getAllReviewsSummary(int page, int size) {
        return reviewRepository.findAll(PageRequest.of(page, size))
                .getContent()
                .stream()
                .map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", r.getId());
                    m.put("username", r.getUser() != null ? r.getUser().getUsername() : "unknown");
                    m.put("language", r.getLanguageDetected());
                    m.put("severity", r.getSeverityLevel());
                    m.put("qualityScore", r.getQualityScore());
                    m.put("createdAt", r.getCreatedAt());
                    return m;
                })
                .collect(Collectors.toList());
    }
}
