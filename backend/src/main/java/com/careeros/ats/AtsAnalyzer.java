package com.careeros.ats;

import com.careeros.ats.engine.DeterministicAtsScorer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AtsAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(AtsAnalyzer.class);

    private final KeywordExtractor keywordExtractor;
    private final ResumeScorer resumeScorer;
    private final DeterministicAtsScorer deterministicAtsScorer;

    public AtsAnalyzer(KeywordExtractor keywordExtractor,
                       ResumeScorer resumeScorer,
                       DeterministicAtsScorer deterministicAtsScorer) {
        this.keywordExtractor = keywordExtractor;
        this.resumeScorer = resumeScorer;
        this.deterministicAtsScorer = deterministicAtsScorer;
    }

    public AtsResponse analyze(String extractedText) {
        log.info("Starting deterministic ATS analysis — textLength={}",
                extractedText != null ? extractedText.length() : 0);

        if (extractedText == null || extractedText.isBlank()) {
            return new AtsResponse(0, List.of(), List.of(), List.of());
        }

        // 1. Deterministic evaluation
        DeterministicAtsScorer.OverallScoreResult scoreResult = deterministicAtsScorer.scoreOverallResume(extractedText);

        // 2. Keyword extraction
        List<KeywordMatch> keywordMatches = keywordExtractor.extractKeywords(extractedText);

        // 3. Section detection
        List<String> detectedSections = resumeScorer.detectSections(extractedText);

        // 4. Suggestions
        List<AtsSuggestion> suggestions = new ArrayList<>();
        for (String imp : scoreResult.improvements()) {
            suggestions.add(new AtsSuggestion(imp, "content"));
        }
        for (String warn : scoreResult.warnings()) {
            suggestions.add(new AtsSuggestion(warn, "formatting"));
        }

        AtsResponse response = new AtsResponse(
                scoreResult.overallScore(),
                keywordMatches,
                detectedSections,
                suggestions
        );
        response.setSummary(scoreResult.readinessLevel() + " (" + scoreResult.overallScore() + "/100). "
                + (scoreResult.strengths().isEmpty() ? "" : scoreResult.strengths().get(0)));

        return response;
    }
}
