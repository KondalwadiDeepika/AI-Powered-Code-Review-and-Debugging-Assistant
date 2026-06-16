package com.example.smart_code_reviewer.controller;

import com.example.smart_code_reviewer.service.CodeAnalysisService;
import com.example.smart_code_reviewer.service.CodeAnalysisService.CodeMetrics;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Lightweight, synchronous pre-analysis endpoint.
 * Returns language detection + code metrics instantly (no AI call).
 */
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final CodeAnalysisService codeAnalysisService;

    @PostMapping("/quick")
    public ResponseEntity<Map<String, Object>> quickAnalyze(@RequestBody Map<String, String> body) {
        String code = body.getOrDefault("code", "");
        if (code.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String language = codeAnalysisService.detectLanguage(code);
        CodeMetrics metrics = codeAnalysisService.computeMetrics(code);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("detectedLanguage", language);
        result.put("totalLines", metrics.totalLines());
        result.put("codeLines", metrics.codeLines());
        result.put("blankLines", metrics.blankLines());
        result.put("commentLines", metrics.commentLines());
        result.put("commentRatio", String.format("%.1f%%", metrics.commentRatio() * 100));
        result.put("maxNestingDepth", metrics.maxNestingDepth());
        result.put("readabilityHint", metrics.commentRatio() < 0.05 ? "Low comment coverage" : "Adequate comments");

        return ResponseEntity.ok(result);
    }
}
