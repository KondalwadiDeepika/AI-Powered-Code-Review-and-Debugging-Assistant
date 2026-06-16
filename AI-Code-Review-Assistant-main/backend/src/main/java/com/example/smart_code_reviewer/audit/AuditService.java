package com.example.smart_code_reviewer.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(String username, AuditLog.AuditAction action, String resourceType,
                    Long resourceId, String details, String ipAddress) {
        try {
            AuditLog entry = AuditLog.builder()
                    .username(username)
                    .action(action.name())
                    .actionType(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .details(details)
                    .ipAddress(ipAddress)
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("Failed to persist audit log for user {}: {}", username, e.getMessage());
        }
    }

    @Async
    public void log(String username, AuditLog.AuditAction action, String details) {
        log(username, action, null, null, details, null);
    }

    public Page<AuditLog> getLogsForUser(String username, int page, int size) {
        return auditLogRepository.findByUsernameOrderByCreatedAtDesc(
                username, PageRequest.of(page, size));
    }

    public List<Object[]> getActionSummary() {
        return auditLogRepository.countByActionType();
    }

    public List<Object[]> getTopActiveUsers() {
        return auditLogRepository.topActiveUsers();
    }
}
