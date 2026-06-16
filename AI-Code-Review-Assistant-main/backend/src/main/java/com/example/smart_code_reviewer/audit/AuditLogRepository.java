package com.example.smart_code_reviewer.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByUsernameOrderByCreatedAtDesc(String username, Pageable pageable);

    List<AuditLog> findByActionTypeOrderByCreatedAtDesc(AuditLog.AuditAction actionType);

    @Query("SELECT a FROM AuditLog a WHERE a.createdAt BETWEEN :from AND :to ORDER BY a.createdAt DESC")
    List<AuditLog> findBetweenDates(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT a.actionType, COUNT(a) FROM AuditLog a GROUP BY a.actionType")
    List<Object[]> countByActionType();

    @Query("SELECT a.username, COUNT(a) FROM AuditLog a GROUP BY a.username ORDER BY COUNT(a) DESC")
    List<Object[]> topActiveUsers();

    long countByUsername(String username);

    void deleteByCreatedAtBefore(LocalDateTime before);
}
