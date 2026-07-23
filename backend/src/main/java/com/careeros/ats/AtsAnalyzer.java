package com.careeros.ats;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Orchestrates the full ATS analysis pipeline for a single resume:
 * <p>
 * {@code
 * Extracted Text
 *   → Keyword Extraction
 *     → Section Detection
 *       → Score Calculation
 *         → Suggestion Generation
 *           → AtsResponse
 * }
 * <p>
 * This is a placeholder implementation. No actual ATS algorithm or AI
 * processing is performed. The architecture is modular so each step can
 * be independently replaced with real logic in the future.
 */
@Component
public class AtsAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(AtsAnalyzer.class);

    private final KeywordExtractor keywordExtractor;
    private final ResumeScorer resumeScorer;

    public AtsAnalyzer(KeywordExtractor keywordExtractor,
                       ResumeScorer resumeScorer) {
        this.keywordExtractor = keywordExtractor;
        this.resumeScorer = resumeScorer;
    }

    /**
     * Run the full ATS analysis pipeline on an extracted resume text.
     *
     * @param extractedText the plain text content of the resume
     * @return AtsResponse containing all analysis results
     */
    public AtsResponse analyze(String extractedText) {
        log.info("Starting ATS analysis — textLength={}",
                extractedText != null ? extractedText.length() : 0);

        // 1. Keyword extraction
        List<KeywordMatch> keywordMatches = keywordExtractor.extractKeywords(extractedText);

        // 2. Section detection
        List<String> detectedSections = resumeScorer.detectSections(extractedText);

        // 3. Score calculation
        int score = resumeScorer.calculateScore(extractedText, keywordMatches, detectedSections);

        // 4. Suggestion generation
        List<AtsSuggestion> suggestions = generateSuggestions(
                extractedText, keywordMatches, detectedSections, score);

        // 5. Build response
        return new AtsResponse(
                score,
                keywordMatches,
                detectedSections,
                suggestions
        );
    }

    /**
     * Placeholder method to generate ATS improvement suggestions.
     * <p>
     * Currently returns static suggestions. Future implementation will
     * generate contextual recommendations based on missing keywords,
     * weak sections, formatting issues, and job description alignment.
     *
     * @param extractedText    the plain text content of the resume
     * @param keywordMatches   keywords found in the resume
     * @param detectedSections sections detected in the resume
     * @param score            the calculated ATS score
     * @return list of AtsSuggestion objects
     */
    public List<AtsSuggestion> generateSuggestions(String extractedText,
                                                    List<KeywordMatch> keywordMatches,
                                                    List<String> detectedSections,
                                                    int score) {
        log.debug("generateSuggestions called — score={}, keywords={}, sections={}",
                score, keywordMatches.size(), detectedSections.size());

        List<AtsSuggestion> suggestions = new ArrayList<>();

        // Placeholder suggestions
        suggestions.add(new AtsSuggestion(
                "Add a professional summary section at the top of your resume",
                "structure"
        ));
        suggestions.add(new AtsSuggestion(
                "Use more industry-standard keywords relevant to your target role",
                "keywords"
        ));
        suggestions.add(new AtsSuggestion(
                "Quantify achievements with metrics and numbers where possible",
                "content"
        ));
        suggestions.add(new AtsSuggestion(
                "Ensure consistent formatting for all section headers",
                "formatting"
        ));
        suggestions.add(new AtsSuggestion(
                "Tailor your resume to the specific job description",
                "strategy"
        ));

        return suggestions;
    }
}

