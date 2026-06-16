package com.example.smart_code_reviewer.service;

import com.example.smart_code_reviewer.dto.UserProfileDTOs.*;
import com.example.smart_code_reviewer.exception.DuplicateResourceException;
import com.example.smart_code_reviewer.exception.ResourceNotFoundException;
import com.example.smart_code_reviewer.model.Review;
import com.example.smart_code_reviewer.model.User;
import com.example.smart_code_reviewer.repository.ReviewRepository;
import com.example.smart_code_reviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        long reviewsThisWeek = reviewRepository
                .findRecentByUser(user.getId(), LocalDateTime.now().minusDays(7)).size();

        OptionalDouble avgQuality = reviews.stream()
                .filter(r -> r.getQualityScore() != null)
                .mapToInt(Review::getQualityScore).average();
        OptionalDouble avgSecurity = reviews.stream()
                .filter(r -> r.getSecurityScore() != null)
                .mapToInt(Review::getSecurityScore).average();

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(user.getId());
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setRole(user.getRole().name());
        profile.setCreatedAt(user.getCreatedAt());
        profile.setTotalReviews(reviews.size());
        profile.setReviewsThisWeek(reviewsThisWeek);
        profile.setAvgQualityScore(avgQuality.orElse(0));
        profile.setAvgSecurityScore(avgSecurity.orElse(0));
        return profile;
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", username);
    }

    @Transactional
    public void updateEmail(String username, String newEmail) {
        if (userRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("Email already in use: " + newEmail);
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        user.setEmail(newEmail);
        userRepository.save(user);
    }
}
