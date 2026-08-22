package com.careeros.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsDetailedResponseDto {

    private String analysisMode; // "OVERALL" or "JOB_SPECIFIC"
    private Long resumeId;
    private String jobTitle;
    private String companyName;

    // Extraction Metadata
    private String extractionStatus; // "EXCELLENT", "GOOD", "OCR_USED", "PARTIAL", "FAILED"
    private String extractionMethod; // "PDFBOX_DIRECT", "OCR_FALLBACK", "POI_DOCX", "HYBRID", "NONE"
    private Double extractionConfidence;

    // Overall Score (Always present)
    private int overallScore;
    private String readinessLevel; // "Needs significant improvement", "Basic ATS readiness", "Good foundation", "Strong ATS readiness", "Excellent ATS readiness"

    // Job Match Score (Present when mode == JOB_SPECIFIC)
    private Integer jobMatchScore;
    private String matchLevel;

    private String summary;
    private List<CategoryBreakdownDto> breakdown;

    // Skills
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> additionalResumeSkills;

    // Keywords
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private Double keywordMatchPercentage;

    // Qualitative Feedback
    private List<String> strengths;
    private List<String> improvements;
    private List<String> warnings;

    private String analyzedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryBreakdownDto {
        private String category;
        private int score;
        private int maxScore;
        private double percentage;
        private String feedback;
    }
}
