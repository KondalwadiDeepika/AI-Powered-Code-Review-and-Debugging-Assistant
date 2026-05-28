package com.example.smart_code_reviewer.repository;

import com.example.smart_code_reviewer.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Map;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT r.languageDetected, COUNT(r) FROM Review r GROUP BY r.languageDetected")
    List<Object[]> countByLanguage();

    @Query("SELECT r.severityLevel, COUNT(r) FROM Review r GROUP BY r.severityLevel")
    List<Object[]> countBySeverity();

    long countByUserId(Long userId);
}
