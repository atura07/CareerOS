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

        if (lower.contains("summary") || lower.contains("objective") || lower.contains("profile") || lower.contains("about") || lower.contains("overview") || lower.contains("highlights")) {
            detectedSections.add("Summary");
        }
        if (lower.contains("education") || lower.contains("academic") || lower.contains("university") || lower.contains("college") || lower.contains("degree") || lower.contains("school") || lower.contains("qualification")) {
            detectedSections.add("Education");
        }
        if (lower.contains("skill") || lower.contains("technolog") || lower.contains("tools") || lower.contains("stack") || lower.contains("expertise") || lower.contains("competenc") || lower.contains("proficienc") || lower.contains("languages")) {
            detectedSections.add("Skills");
        }
        if (lower.contains("experience") || lower.contains("employment") || lower.contains("work history") || lower.contains("intern") || lower.contains("career") || lower.contains("work")) {
            detectedSections.add("Experience");
        }
        if (lower.contains("project") || lower.contains("portfolio") || lower.contains("initiatives") || lower.contains("applications built")) {
            detectedSections.add("Projects");
        }
        if (lower.contains("certif") || lower.contains("achievement") || lower.contains("award") || lower.contains("honor") || lower.contains("license") || lower.contains("publication") || lower.contains("leadership")) {
            detectedSections.add("Certifications");
        }

        List<String> warnings = new ArrayList<>();

        // 4. Determine status and confidence
        ExtractionStatus status;
        double confidence;

        if (charCount < MIN_USABLE_CHAR_COUNT || alphaRatio < MIN_ALPHA_RATIO || wordCount < 8) {
            status = ExtractionStatus.FAILED;
            confidence = 0.1;
            warnings.add("Insufficient readable text extracted from document.");
        } else if (charCount >= GOOD_CHAR_COUNT && alphaRatio >= 0.65 && detectedSections.size() >= 2) {
            status = ExtractionStatus.EXCELLENT;
            confidence = 0.95;
        } else if (charCount >= 100 && alphaRatio >= 0.50 && detectedSections.size() >= 1) {
            status = ExtractionStatus.GOOD;
            confidence = 0.85;
        } else {
            status = ExtractionStatus.PARTIAL;
            confidence = 0.65;
            warnings.add("Partial text extracted. Some sections may be unformatted or missing headings.");
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
