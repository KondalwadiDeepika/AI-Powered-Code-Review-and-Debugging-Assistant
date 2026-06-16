package com.example.smart_code_reviewer.repository;

import com.example.smart_code_reviewer.model.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT r.languageDetected, COUNT(r) FROM Review r GROUP BY r.languageDetected")
    List<Object[]> countByLanguage();

    @Query("SELECT r.severityLevel, COUNT(r) FROM Review r GROUP BY r.severityLevel")
    List<Object[]> countBySeverity();

    long countByUserId(Long userId);

    long countByCreatedAtAfter(LocalDateTime after);

    long countBySeverityLevel(Review.SeverityLevel level);

    @Query("SELECT AVG(r.qualityScore) FROM Review r WHERE r.qualityScore IS NOT NULL")
    Double averageQualityScore();

    @Query("SELECT AVG(r.securityScore) FROM Review r WHERE r.securityScore IS NOT NULL")
    Double averageSecurityScore();

    @Query("SELECT AVG(r.performanceScore) FROM Review r WHERE r.performanceScore IS NOT NULL")
    Double averagePerformanceScore();

    @Query("SELECT r FROM Review r WHERE r.severityLevel IN ('HIGH', 'CRITICAL') ORDER BY r.createdAt DESC")
    List<Review> findHighAndCriticalReviews(Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId AND r.createdAt >= :since ORDER BY r.createdAt DESC")
    List<Review> findRecentByUser(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT r.languageDetected, AVG(r.qualityScore), AVG(r.securityScore), AVG(r.performanceScore), COUNT(r) " +
           "FROM Review r GROUP BY r.languageDetected")
    List<Object[]> aggregateStatsByLanguage();
}
