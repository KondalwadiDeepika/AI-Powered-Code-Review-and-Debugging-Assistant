package com.example.smart_code_reviewer.scheduler;

import com.example.smart_code_reviewer.audit.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Scheduled maintenance tasks that run in the background to keep
 * the database clean and the audit trail from growing unbounded.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CleanupScheduler {

    private final AuditLogRepository auditLogRepository;

    /** Purge audit logs older than 90 days — runs at 2 AM every day. */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void purgeOldAuditLogs() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(90);
        log.info("Purging audit logs older than {}", cutoff);
        auditLogRepository.deleteByCreatedAtBefore(cutoff);
        log.info("Audit log purge complete");
    }

    /** Log a health-check heartbeat every 10 minutes. */
    @Scheduled(fixedDelay = 600_000)
    public void heartbeat() {
        log.debug("Scheduler heartbeat — system is running");
    }
}
