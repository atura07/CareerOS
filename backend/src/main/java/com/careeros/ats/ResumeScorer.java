package com.careeros.ats;

import com.careeros.ats.engine.DeterministicAtsScorer;
import com.careeros.ats.engine.SkillTaxonomyEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Production ATS Resume Scorer and Section Detector.
 * Delegates to DeterministicAtsScorer and SkillTaxonomyEngine for authentic analysis.
 */
@Component
public class ResumeScorer {

    private static final Logger log = LoggerFactory.getLogger(ResumeScorer.class);

    private final DeterministicAtsScorer deterministicAtsScorer;
    private final SkillTaxonomyEngine skillTaxonomyEngine;

    public ResumeScorer(DeterministicAtsScorer deterministicAtsScorer,
                        SkillTaxonomyEngine skillTaxonomyEngine) {
        this.deterministicAtsScorer = deterministicAtsScorer;
        this.skillTaxonomyEngine = skillTaxonomyEngine;
    }

    public int calculateScore(String extractedText,
                              List<KeywordMatch> keywordMatches,
                              List<String> detectedSections) {
        if (extractedText == null || extractedText.isBlank()) return 0;
        DeterministicAtsScorer.OverallScoreResult result = deterministicAtsScorer.scoreOverallResume(extractedText);
        return result.overallScore();
    }

    public List<String> detectSections(String extractedText) {
        if (extractedText == null || extractedText.isBlank()) return List.of();

        List<String> detected = new ArrayList<>();
        String lower = extractedText.toLowerCase();

        if (lower.contains("summary") || lower.contains("objective") || lower.contains("profile")) {
            detected.add("Summary");
        }
        if (lower.contains("education") || lower.contains("academic")) {
            detected.add("Education");
        }
        if (lower.contains("skills") || lower.contains("technologies") || lower.contains("technical skills")) {
            detected.add("Skills");
        }
        if (lower.contains("experience") || lower.contains("employment") || lower.contains("internship")) {
            detected.add("Experience");
        }
        if (lower.contains("projects") || lower.contains("project")) {
            detected.add("Projects");
        }
        if (lower.contains("certifications") || lower.contains("certificates") || lower.contains("achievements") || lower.contains("awards")) {
            detected.add("Certifications");
        }

        return detected;
    }
}
