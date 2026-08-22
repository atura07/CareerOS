package com.careeros.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsIntelligenceDto {

    private String analysisId;
    private Long resumeId;
    private String mode; // "UNIVERSAL" or "JOB_MATCH"
    private String targetRole; // "Software Engineer", "Backend Developer", etc.
    private String analysisStatus; // "ANALYSIS_COMPLETE", "PARTIAL_ANALYSIS", "ANALYSIS_UNAVAILABLE"

    // Scores & Confidence (Strictly Separated)
    private int overallScore; // 0-100
    private String scoreLabel; // "Excellent", "Strong", "Good Foundation", "Needs Improvement", "Needs Significant Improvement", "Critical Improvements Needed"
    private int confidence; // 0-100%
    private String confidenceMessage;

    // Job Match Scores (When mode == "JOB_MATCH")
    private Integer jobMatchScore;
    private String matchLevel;
    private String jobTitle;
    private String companyName;

    // Extraction Telemetry
    private ExtractionTelemetryDto extraction;

    // Executive Summary
    private SummaryHeadlineDto summary;

    // 7 Category Breakdown
    @Builder.Default
    private List<CategoryDetailDto> scoreBreakdown = new ArrayList<>();

    // Evidence & Insights
    @Builder.Default
    private List<String> strengths = new ArrayList<>();
    @Builder.Default
    private List<ActionableIssueDto> criticalIssues = new ArrayList<>();
    @Builder.Default
    private List<String> quickWins = new ArrayList<>();
    @Builder.Default
    private List<DetailedRecommendationDto> detailedRecommendations = new ArrayList<>();

    // Skills & Keywords
    private KeywordIntelligenceDto keywordAnalysis;
    private JobMatchDetailsDto jobMatch;

    // Real Historical Comparison (Only populated when previous real analysis exists)
    private HistoryComparisonDto historyComparison;

    private String analyzedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractionTelemetryDto {
        private String status; // "EXCELLENT", "GOOD", "OCR_USED", "PARTIAL", "FAILED"
        private String method; // "PDFBOX_DIRECT", "OCR_FALLBACK", "POI_DOCX", "NONE"
        private double confidence;
        private int characterCount;
        private int wordCount;
        private double alphaRatio;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummaryHeadlineDto {
        private String headline;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDetailDto {
        private String category;
        private int score;
        private int maxScore;
        private int weight;
        private String status; // "STRONG", "GOOD", "NEEDS_IMPROVEMENT", "CRITICAL"
        private String reason;
        @Builder.Default
        private List<String> evidence = new ArrayList<>();
        @Builder.Default
        private List<String> recommendations = new ArrayList<>();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionableIssueDto {
        private String title;
        private String impactLevel; // "HIGH IMPACT", "MEDIUM IMPACT", "LOW IMPACT"
        private String category;
        private String fix;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetailedRecommendationDto {
        private String title;
        private String problem;
        private String whyItMatters;
        private String evidence;
        private String suggestedImprovement;
        private String impact; // "HIGH", "MEDIUM", "LOW"
        private String priority; // "P1", "P2", "P3"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KeywordIntelligenceDto {
        @Builder.Default
        private List<String> matched = new ArrayList<>();
        @Builder.Default
        private List<String> missing = new ArrayList<>();
        @Builder.Default
        private List<SuggestedKeywordItemDto> suggested = new ArrayList<>();
        private double keywordCoverage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedKeywordItemDto {
        private String keyword;
        private String category;
        private String whyItMatters;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobMatchDetailsDto {
        private int requiredSkillsScore;
        private int preferredSkillsScore;
        private int experienceScore;
        private int educationScore;
        private int semanticScore;
        @Builder.Default
        private List<String> matchedRequiredSkills = new ArrayList<>();
        @Builder.Default
        private List<String> missingRequiredSkills = new ArrayList<>();
        @Builder.Default
        private List<String> matchedPreferredSkills = new ArrayList<>();
        @Builder.Default
        private List<String> missingPreferredSkills = new ArrayList<>();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HistoryComparisonDto {
        private int previousOverallScore;
        private int scoreDelta; // e.g. +6 or -2
        private String previousAnalyzedAt;
        @Builder.Default
        private List<String> improvements = new ArrayList<>();
        @Builder.Default
        private List<String> regressions = new ArrayList<>();
        @Builder.Default
        private List<String> unchanged = new ArrayList<>();
    }
}
