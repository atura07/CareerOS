package com.careeros.ats;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service for single-text ATS analysis.
 * <p>
 * Runs the ATS analysis pipeline on raw extracted resume text
 * (no job description comparison).
 */
@Service
public class AtsService {

    private static final Logger log = LoggerFactory.getLogger(AtsService.class);

    private final AtsAnalyzer atsAnalyzer;

    public AtsService(AtsAnalyzer atsAnalyzer) {
        this.atsAnalyzer = atsAnalyzer;
    }

    /**
     * Analyze raw resume text and return an ATS score, keyword matches,
     * detected sections, and suggestions.
     *
     * @param extractedText the plain text content of the resume
     * @return AtsResponse with analysis results
     */
    public AtsResponse analyzeText(String extractedText) {
        log.info("analyzeText called — textLength={}",
                extractedText != null ? extractedText.length() : 0);

        if (extractedText == null || extractedText.isBlank()) {
            log.warn("Empty extracted text — returning empty analysis");
            return new AtsResponse(0, java.util.List.of(), java.util.List.of(), java.util.List.of());
        }

        return atsAnalyzer.analyze(extractedText);
    }
}

