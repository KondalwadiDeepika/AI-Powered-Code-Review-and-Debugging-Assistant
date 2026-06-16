package com.example.smart_code_reviewer.service;

import com.example.smart_code_reviewer.exception.ResourceNotFoundException;
import com.example.smart_code_reviewer.model.Review;
import com.example.smart_code_reviewer.model.User;
import com.example.smart_code_reviewer.repository.ReviewRepository;
import com.example.smart_code_reviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeReviewService {

    private final ChatClient chatClient;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    private static final String SYSTEM_PROMPT = """
        Analyze the provided source code and generate a complete professional code review report based ONLY on the original submitted code.

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 🏳️ Language Detected
        ━━━━━━━━━━━━━━━━━━━━━━━
        (Detect and state the programming language)

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 📊 Severity Level
        ━━━━━━━━━━━━━━━━━━━━━━━
        (ONE of: LOW | MEDIUM | HIGH | CRITICAL)
        - LOW: minor style/formatting issues only
        - MEDIUM: logic errors or bad practices
        - HIGH: security vulnerabilities or major bugs
        - CRITICAL: crashes, SQL injection, XSS, hardcoded secrets, infinite loops, data exposure

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 🔍 Compilation & Execution Status
        ━━━━━━━━━━━━━━━━━━━━━━━
        - **Can it compile?** Yes/No — reason
        - **Can it run successfully?** Yes/No — reason
        - **Will it terminate?** Yes/No — reason

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 🐞 Bug Report
        ━━━━━━━━━━━━━━━━━━━━━━━

        #### 🔴 Compile-Time Errors
        For each issue: severity | reason | impact | prevents compilation?
        - **[ERROR]** ...
        If none: ✅ None detected.

        #### 🟠 Runtime Exceptions
        For each issue: exception type | reason | impact | causes runtime failure?
        - **[EXCEPTION]** Type: ...
        If none: ✅ None detected.

        #### 🔵 Syntax Errors
        - **[SYNTAX]** Description | reason | impact
        If none: ✅ None detected.

        #### 🟡 Logical Errors
        - **[LOGIC]** Description | reason | impact | produces wrong output?
        If none: ✅ None detected.

        #### ⚡ Performance Issues
        - **[PERF]** Description | reason | impact
        If none: ✅ None detected.

        #### 🧹 Code Quality Issues
        - **[QUALITY]** Description | reason | impact
        If none: ✅ None detected.

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 🔐 Security Analysis
        ━━━━━━━━━━━━━━━━━━━━━━━
        Detect: SQL Injection, XSS, hardcoded credentials, insecure deserialization, buffer overflow, unsafe operations, risky practices.
        For each: severity | vulnerability type | description | security impact
        If none: ✅ No security vulnerabilities detected.

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 📈 Performance Analysis (of ORIGINAL code only)
        ━━━━━━━━━━━━━━━━━━━━━━━
        - **Time Complexity:** O(?) — explanation
        - **Space Complexity:** O(?) — explanation
        - **Terminates?** Yes/No
        - **Infinite Loop Present?** Yes/No — if yes, describe location and impact
        - **Resource Usage Issues:** memory leaks, unclosed streams, expensive operations, etc.

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 🧹 Code Quality Analysis
        ━━━━━━━━━━━━━━━━━━━━━━━
        - **Readability:** (score /10 + comments)
        - **Maintainability:** (score /10 + comments)
        - **Modularity:** (score /10 + comments)
        - **Naming Conventions:** (Good/Poor + comments)
        - **Error Handling:** (Present/Missing + comments)
        - **Best Practices Violations:** (list each violation)

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### 📊 Scores (out of 100) — Based on ORIGINAL code ONLY
        ━━━━━━━━━━━━━━━━━━━━━━━
        IMPORTANT: Scores must reflect the original submitted code only.
        - Quality Score: (number)/100 — reason
        - Security Score: (number)/100 — reason
        - Performance Score: (number)/100 — reason

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### ✨ Suggested Improvements
        ━━━━━━━━━━━━━━━━━━━━━━━
        For each issue found: how to fix it, better alternatives, optimizations, safer approaches.

        ━━━━━━━━━━━━━━━━━━━━━━━
        ### ✅ Corrected & Optimized Code
        ━━━━━━━━━━━━━━━━━━━━━━━
        Provide the fully corrected version in a code block.
        """;

    public Review reviewCode(String code) {
        log.info("Starting code review, code length: {}", code.length());

        String result = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(code)
                .call()
                .content();

        String language = extractSection(result, "Language Detected");
        String severityStr = extractSection(result, "Severity Level").split("\n")[0].trim().toUpperCase();
        Review.SeverityLevel severity = parseSeverity(severityStr);

        int qualityScore = extractScore(result, "Quality Score");
        int securityScore = extractScore(result, "Security Score");
        int performanceScore = extractScore(result, "Performance Score");

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);

        Review review = Review.builder()
                .user(user)
                .codeSnippet(code.length() > 2000 ? code.substring(0, 2000) : code)
                .reviewResult(result)
                .languageDetected(language.isBlank() ? "Unknown" : language.trim())
                .severityLevel(severity)
                .qualityScore(qualityScore)
                .securityScore(securityScore)
                .performanceScore(performanceScore)
                .build();

        Review saved = reviewRepository.save(review);
        log.info("Code review saved with id={}, severity={}", saved.getId(), saved.getSeverityLevel());
        return saved;
    }

    public List<Review> getUserHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Optional<Review> getReviewById(Long id, String username) {
        return reviewRepository.findById(id)
                .filter(r -> r.getUser() != null && r.getUser().getUsername().equals(username));
    }

    public List<Object[]> getLanguageStats() {
        return reviewRepository.countByLanguage();
    }

    public List<Object[]> getSeverityStats() {
        return reviewRepository.countBySeverity();
    }

    public List<Object[]> getLanguageAggregate() {
        return reviewRepository.aggregateStatsByLanguage();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private String extractSection(String text, String heading) {
        int start = text.indexOf(heading);
        if (start == -1) return "";
        start = text.indexOf("\n", start) + 1;
        int end = text.indexOf("###", start);
        return end == -1 ? text.substring(start) : text.substring(start, end);
    }

    private Review.SeverityLevel parseSeverity(String s) {
        if (s.contains("CRITICAL")) return Review.SeverityLevel.CRITICAL;
        if (s.contains("HIGH"))     return Review.SeverityLevel.HIGH;
        if (s.contains("MEDIUM"))   return Review.SeverityLevel.MEDIUM;
        return Review.SeverityLevel.LOW;
    }

    private int extractScore(String text, String label) {
        int idx = text.indexOf(label);
        if (idx == -1) return 70;
        String sub = text.substring(idx + label.length(),
                Math.min(idx + label.length() + 10, text.length()));
        sub = sub.replaceAll("[^0-9]", "").trim();
        if (sub.isEmpty()) return 70;
        try {
            return Math.min(100, Math.max(0,
                    Integer.parseInt(sub.substring(0, Math.min(3, sub.length())))));
        } catch (NumberFormatException e) {
            return 70;
        }
    }
}
