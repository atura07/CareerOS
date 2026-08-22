package com.careeros.ats.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ats_analyses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsAnalysisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "resume_id", nullable = false)
    private Long resumeId;

    @Column(name = "analysis_mode", nullable = false, length = 50)
    private String analysisMode; // "UNIVERSAL" / "OVERALL" or "JOB_SPECIFIC"

    @Column(name = "target_role", length = 100)
    private String targetRole;

    @Column(name = "analysis_status", length = 50)
    private String analysisStatus; // "ANALYSIS_COMPLETE", "PARTIAL_ANALYSIS", "ANALYSIS_UNAVAILABLE"

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "job_description_hash", length = 64)
    private String jobDescriptionHash;

    @Column(name = "extraction_status", length = 50)
    private String extractionStatus; // "EXCELLENT", "GOOD", "OCR_USED", "PARTIAL", "FAILED"

    @Column(name = "extraction_method", length = 50)
    private String extractionMethod; // "PDFBOX_DIRECT", "OCR_FALLBACK", "POI_DOCX", "HYBRID", "NONE"

    @Column(name = "extraction_confidence")
    private Double extractionConfidence;

    @Column(name = "confidence_score")
    private Integer confidenceScore; // 0-100%

    @Column(name = "overall_score")
    private Integer overallScore; // 0-100

    @Column(name = "score_label", length = 50)
    private String scoreLabel; // "Excellent", "Strong", "Good Foundation", etc.

    @Column(name = "job_match_score")
    private Integer jobMatchScore;

    // Mode 1: 7 Category Scores
    @Column(name = "parsability_score")
    private Integer parsabilityScore; // 0-15

    @Column(name = "completeness_score")
    private Integer completenessScore; // 0-20

    @Column(name = "contact_score")
    private Integer contactScore; // 0-10

    @Column(name = "skills_score")
    private Integer skillsScore; // 0-15

    @Column(name = "experience_score")
    private Integer experienceScore; // 0-20

    @Column(name = "readability_score")
    private Integer readabilityScore; // 0-10

    @Column(name = "achievements_score")
    private Integer achievementsScore; // 0-10

    // Legacy / Mode 2: Job Match Scores
    @Column(name = "ats_compatibility_score")
    private Integer atsCompatibilityScore; // backward compat

    @Column(name = "impact_score")
    private Integer impactScore; // backward compat

    @Column(name = "language_score")
    private Integer languageScore; // backward compat

    @Column(name = "required_skills_score")
    private Integer requiredSkillsScore; // 0-30

    @Column(name = "preferred_skills_score")
    private Integer preferredSkillsScore; // 0-10

    @Column(name = "keyword_score")
    private Integer keywordScore; // 0-20

    @Column(name = "responsibility_score")
    private Integer responsibilityScore; // 0-20

    @Column(name = "eligibility_score")
    private Integer eligibilityScore; // 0-10

    @Column(name = "semantic_score")
    private Integer semanticScore; // 0-20

    // JSON Storage
    @Column(name = "matched_skills_json", columnDefinition = "TEXT")
    private String matchedSkillsJson;

    @Column(name = "missing_skills_json", columnDefinition = "TEXT")
    private String missingSkillsJson;

    @Column(name = "additional_skills_json", columnDefinition = "TEXT")
    private String additionalSkillsJson;

    @Column(name = "matched_keywords_json", columnDefinition = "TEXT")
    private String matchedKeywordsJson;

    @Column(name = "missing_keywords_json", columnDefinition = "TEXT")
    private String missingKeywordsJson;

    @Column(name = "breakdown_json", columnDefinition = "TEXT")
    private String breakdownJson;

    @Column(name = "evidence_json", columnDefinition = "TEXT")
    private String evidenceJson;

    @Column(name = "quick_wins_json", columnDefinition = "TEXT")
    private String quickWinsJson;

    @Column(name = "strengths_json", columnDefinition = "TEXT")
    private String strengthsJson;

    @Column(name = "improvements_json", columnDefinition = "TEXT")
    private String improvementsJson;

    @Column(name = "warnings_json", columnDefinition = "TEXT")
    private String warningsJson;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
