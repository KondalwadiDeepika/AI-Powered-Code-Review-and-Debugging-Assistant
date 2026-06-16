package com.example.smart_code_reviewer.audit;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String action;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "resource_type")
    private String resourceType;

    @Column(name = "resource_id")
    private Long resourceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction actionType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public enum AuditAction {
        LOGIN, LOGOUT, SIGNUP, CODE_REVIEW, VIEW_HISTORY,
        VIEW_ANALYTICS, ADMIN_ACTION, PASSWORD_CHANGE, RATE_LIMIT_HIT
    }
}
