package com.example.smart_code_reviewer.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Lightweight language-detection and code-metric utilities.
 * These run locally (no AI call) to provide instant feedback
 * before the full AI review is returned.
 */
@Service
@Slf4j
public class CodeAnalysisService {

    private static final Map<String, List<Pattern>> LANGUAGE_SIGNATURES = new LinkedHashMap<>();

    static {
        LANGUAGE_SIGNATURES.put("Java", List.of(
                Pattern.compile("public\\s+(class|interface|enum|record)\\s+\\w+"),
                Pattern.compile("import\\s+java\\."),
                Pattern.compile("@Override|@Autowired|@SpringBootApplication")
        ));
        LANGUAGE_SIGNATURES.put("Python", List.of(
                Pattern.compile("def\\s+\\w+\\s*\\("),
                Pattern.compile("import\\s+\\w+|from\\s+\\w+\\s+import"),
                Pattern.compile("if\\s+__name__\\s*==\\s*['\"]__main__['\"]")
        ));
        LANGUAGE_SIGNATURES.put("JavaScript", List.of(
                Pattern.compile("const\\s+\\w+\\s*=|let\\s+\\w+\\s*=|var\\s+\\w+\\s*="),
                Pattern.compile("function\\s+\\w+\\s*\\(|=>\\s*\\{"),
                Pattern.compile("require\\(['\"]|import\\s+.*from\\s+['\"]")
        ));
        LANGUAGE_SIGNATURES.put("TypeScript", List.of(
                Pattern.compile(":\\s*(string|number|boolean|any|void|never)"),
                Pattern.compile("interface\\s+\\w+|type\\s+\\w+\\s*="),
                Pattern.compile("import\\s+\\{.*\\}\\s+from")
        ));
        LANGUAGE_SIGNATURES.put("C++", List.of(
                Pattern.compile("#include\\s*<"),
                Pattern.compile("std::"),
                Pattern.compile("int\\s+main\\s*\\(")
        ));
        LANGUAGE_SIGNATURES.put("SQL", List.of(
                Pattern.compile("(?i)SELECT\\s+.+\\s+FROM"),
                Pattern.compile("(?i)INSERT\\s+INTO|UPDATE\\s+\\w+\\s+SET|DELETE\\s+FROM"),
                Pattern.compile("(?i)CREATE\\s+TABLE|ALTER\\s+TABLE|DROP\\s+TABLE")
        ));
    }

    public String detectLanguage(String code) {
        int bestScore = 0;
        String detected = "Unknown";
        for (Map.Entry<String, List<Pattern>> entry : LANGUAGE_SIGNATURES.entrySet()) {
            int score = 0;
            for (Pattern p : entry.getValue()) {
                if (p.matcher(code).find()) score++;
            }
            if (score > bestScore) {
                bestScore = score;
                detected = entry.getKey();
            }
        }
        return detected;
    }

    public CodeMetrics computeMetrics(String code) {
        String[] lines = code.split("\n");
        int totalLines = lines.length;
        int blankLines = 0;
        int commentLines = 0;
        int codeLines = 0;

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                blankLines++;
            } else if (trimmed.startsWith("//") || trimmed.startsWith("#")
                    || trimmed.startsWith("*") || trimmed.startsWith("/*")) {
                commentLines++;
            } else {
                codeLines++;
            }
        }

        double commentRatio = totalLines > 0 ? (double) commentLines / totalLines : 0;
        int nestingDepth = computeMaxNestingDepth(code);

        return new CodeMetrics(totalLines, codeLines, blankLines, commentLines, commentRatio, nestingDepth);
    }

    private int computeMaxNestingDepth(String code) {
        int depth = 0;
        int maxDepth = 0;
        for (char c : code.toCharArray()) {
            if (c == '{') { depth++; maxDepth = Math.max(maxDepth, depth); }
            else if (c == '}' && depth > 0) { depth--; }
        }
        return maxDepth;
    }

    public record CodeMetrics(
            int totalLines,
            int codeLines,
            int blankLines,
            int commentLines,
            double commentRatio,
            int maxNestingDepth
    ) {}
}
