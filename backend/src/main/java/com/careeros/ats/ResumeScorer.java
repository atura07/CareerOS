package com.careeros.ats;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Placeholder scorer for ATS resume evaluation.
 * <p>
 * This component calculates a placeholder ATS score based on a resume's
 * extracted text, keyword matches, and detected sections.
 * <p>
 * No actual scoring algorithm is implemented yet — this is an architectural
 * placeholder ready for future ATS integration.
 */
@Component
public class ResumeScorer {

    private static final Logger log = LoggerFactory.getLogger(ResumeScorer.class);

    /**
     * Calculate a placeholder ATS score for a resume.
     * <p>
     * Current implementation returns a static score to validate the pipeline.
     * Future implementation will analyze keyword density, section coverage,
     * formatting quality, and job description alignment.
     *
     * @param extractedText  the plain text extracted from the resume
     * @param keywordMatches list of keywords found in the resume
     * @param detectedSections list of section headers detected (e.g. "Experience", "Education")
     * @return a placeholder score between 0 and 100
     */
    public int calculateScore(String extractedText,
                              List<KeywordMatch> keywordMatches,
                              List<String> detectedSections) {
        log.debug("calculateScore called — textLength={}, keywordMatches={}, sections={}",
                extractedText != null ? extractedText.length() : 0,
                keywordMatches != null ? keywordMatches.size() : 0,
                detectedSections != null ? detectedSections.size() : 0);

        // Placeholder: return a static score
        // This will be replaced with actual scoring logic in a future iteration
        return 78;
    }

    /**
     * Detect standard resume sections from extracted text.
     * <p>
     * Scans the text for common section headers like "Experience",
     * "Education", "Skills", "Projects", "Certifications", etc.
     *
     * @param extractedText the plain text extracted from the resume
     * @return list of detected section names
     */
    public List<String> detectSections(String extractedText) {
        log.debug("detectSections called — textLength={}",
                extractedText != null ? extractedText.length() : 0);

        // Placeholder: return a static list of common sections
        // Future implementation will use regex/heuristics to find actual sections
        return List.of(
                "Summary",
                "Experience",
                "Education",
                "Skills",
                "Projects",
                "Certifications"
        );
    }
}

