package com.careeros.resume.extraction;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class ExtractionQualityValidator {

    private static final int MIN_USABLE_CHAR_COUNT = 60;
    private static final int GOOD_CHAR_COUNT = 250;
    private static final double MIN_ALPHA_RATIO = 0.40;

    private static final Pattern WORD_PATTERN = Pattern.compile("[a-zA-Z0-9+#.-]{2,}");

    public record QualityAssessment(
            ExtractionStatus status,
            double confidence,
            double alphaRatio,
            int charCount,
            int wordCount,
            List<String> detectedSections,
            List<String> warnings
    ) {}

    public QualityAssessment assess(String text) {
        if (text == null || text.isBlank()) {
            return new QualityAssessment(
                    ExtractionStatus.FAILED,
                    0.0,
                    0.0,
                    0,
                    0,
                    List.of(),
                    List.of("No readable text found in document.")
            );
        }

        String trimmed = text.trim();
        int charCount = trimmed.length();

        // 1. Calculate alphabetic + numeric ratio
        int letterOrDigitCount = 0;
        int nonWhitespaceCount = 0;

        for (int i = 0; i < trimmed.length(); i++) {
            char c = trimmed.charAt(i);
            if (!Character.isWhitespace(c)) {
                nonWhitespaceCount++;
                if (Character.isLetterOrDigit(c)) {
                    letterOrDigitCount++;
                }
            }
        }

        double alphaRatio = nonWhitespaceCount > 0
                ? (double) letterOrDigitCount / nonWhitespaceCount
                : 0.0;

        // 2. Count words
        var matcher = WORD_PATTERN.matcher(trimmed);
        int wordCount = 0;
        while (matcher.find()) {
            wordCount++;
        }

        // 3. Detect standard resume sections
        List<String> detectedSections = new ArrayList<>();
        String lower = trimmed.toLowerCase();

        if (lower.contains("summary") || lower.contains("objective") || lower.contains("profile") || lower.contains("about me")) {
            detectedSections.add("Summary");
        }
        if (lower.contains("education") || lower.contains("academic") || lower.contains("university") || lower.contains("degree") || lower.contains("bachelor") || lower.contains("master")) {
            detectedSections.add("Education");
        }
        if (lower.contains("skill") || lower.contains("technical skills") || lower.contains("technologies") || lower.contains("tools") || lower.contains("stack")) {
            detectedSections.add("Skills");
        }
        if (lower.contains("experience") || lower.contains("employment") || lower.contains("work history") || lower.contains("internship") || lower.contains("career")) {
            detectedSections.add("Experience");
        }
        if (lower.contains("project") || lower.contains("personal projects") || lower.contains("academic projects")) {
            detectedSections.add("Projects");
        }
        if (lower.contains("certification") || lower.contains("certificate") || lower.contains("achievement") || lower.contains("award") || lower.contains("license")) {
            detectedSections.add("Certifications");
        }

        List<String> warnings = new ArrayList<>();

        // 4. Determine status and confidence
        ExtractionStatus status;
        double confidence;

        if (charCount < MIN_USABLE_CHAR_COUNT || alphaRatio < MIN_ALPHA_RATIO || wordCount < 10) {
            status = ExtractionStatus.FAILED;
            confidence = 0.1;
            warnings.add("Insufficient readable text extracted from document.");
        } else if (charCount >= GOOD_CHAR_COUNT && alphaRatio >= 0.70 && detectedSections.size() >= 3) {
            status = ExtractionStatus.EXCELLENT;
            confidence = 0.95;
        } else if (charCount >= 120 && alphaRatio >= 0.60 && detectedSections.size() >= 2) {
            status = ExtractionStatus.GOOD;
            confidence = 0.85;
        } else {
            status = ExtractionStatus.PARTIAL;
            confidence = 0.50;
            warnings.add("Partial text extracted. Some sections may be missing or unformatted.");
        }

        return new QualityAssessment(
                status,
                confidence,
                Math.round(alphaRatio * 100.0) / 100.0,
                charCount,
                wordCount,
                detectedSections,
                warnings
        );
    }
}
