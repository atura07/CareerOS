package com.careeros.ats;

import com.careeros.resume.ResumeResponse;
import com.careeros.resume.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Deterministic ATS scoring engine.
 * <p>
 * Implements a local, AI-free scoring algorithm:
 * <ol>
 *   <li>Load resume text from the database using ResumeService</li>
 *   <li>Normalize both resume text and job description (lowercase, strip punctuation, collapse spaces)</li>
 *   <li>Extract unique keywords from the job description (excluding common stop words)</li>
 *   <li>Match each JD keyword against the normalized resume text</li>
 *   <li>Calculate score = (matchedKeywords / totalJdKeywords) × 100, rounded to nearest integer</li>
 *   <li>Generate contextual suggestions for missing keywords</li>
 * </ol>
 * <p>
 * No AI, no external APIs — everything runs locally with pure Java.
 */
@Service
public class ATSServiceImpl implements AtsAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ATSServiceImpl.class);

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "for", "with", "of", "to", "in", "on", "is", "are", "a", "an"
    );

    private final ResumeService resumeService;

    public ATSServiceImpl(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @Override
    public ATSAnalysisResponse analyze(Long resumeId, String jobDescription) {
        log.info("analyze called — resumeId={}, jobDescriptionLength={}",
                resumeId, jobDescription != null ? jobDescription.length() : 0);

        // 1. Load the resume from the database to get extracted text
        //    userId=1L is temporary — will be replaced with JWT-authenticated user ID
        Long userId = 1L;
        ResumeResponse resume = resumeService.getResume(resumeId, userId);
        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            log.warn("Resume {} has no extracted text — returning empty analysis", resumeId);
            return new ATSAnalysisResponse(0, List.of(), List.of(), List.of());
        }

        if (jobDescription == null || jobDescription.isBlank()) {
            log.warn("Job description is empty — returning empty analysis");
            return new ATSAnalysisResponse(0, List.of(), List.of(), List.of());
        }

        // 2. Normalize both texts
        String normalizedResume = normalize(resumeText);
        String normalizedJd = normalize(jobDescription);

        // 3. Extract unique keywords from the normalized job description
        List<String> jdKeywords = extractKeywords(normalizedJd);

        if (jdKeywords.isEmpty()) {
            log.warn("No keywords extracted from job description — returning empty analysis");
            return new ATSAnalysisResponse(0, List.of(), List.of(), List.of());
        }

        // 4. Match JD keywords against the normalized resume text
        List<String> matchedKeywords = new ArrayList<>();
        List<String> missingKeywords = new ArrayList<>();

        for (String keyword : jdKeywords) {
            if (normalizedResume.contains(keyword)) {
                matchedKeywords.add(keyword);
            } else {
                missingKeywords.add(keyword);
            }
        }

        // 5. Calculate score = (matched / total) × 100, rounded to nearest integer
        double ratio = (double) matchedKeywords.size() / jdKeywords.size();
        int score = (int) Math.round(ratio * 100);

        // 6. Generate suggestions for missing keywords
        List<String> suggestions = generateSuggestions(missingKeywords);

        log.info("Analysis complete — resumeId={}, score={}, matched={}, missing={}",
                resumeId, score, matchedKeywords.size(), missingKeywords.size());

        return new ATSAnalysisResponse(score, matchedKeywords, missingKeywords, suggestions);
    }

    /**
     * Normalize text for comparison:
     * <ul>
     *   <li>Convert to lowercase</li>
     *   <li>Remove punctuation (replace non-letter, non-digit, non-space characters)</li>
     *   <li>Collapse multiple spaces into a single space</li>
     *   <li>Trim leading/trailing whitespace</li>
     * </ul>
     */
    private String normalize(String text) {
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")  // replace punctuation with space
                .replaceAll("\\s+", " ")           // collapse multiple spaces
                .trim();
    }

    /**
     * Extract unique keywords from normalized text.
     * Splits by whitespace, filters out common stop words,
     * and removes duplicates.
     */
    private List<String> extractKeywords(String normalizedText) {
        return Arrays.stream(normalizedText.split("\\s+"))
                .filter(word -> word.length() > 1)          // skip single chars
                .filter(word -> !STOP_WORDS.contains(word)) // skip stop words
                .distinct()                                 // remove duplicates
                .collect(Collectors.toList());
    }

    /**
     * Generate a suggestion for each missing keyword.
     * Uses the form: "Consider adding experience with {keyword}."
     */
    private List<String> generateSuggestions(List<String> missingKeywords) {
        List<String> suggestions = new ArrayList<>();
        for (String keyword : missingKeywords) {
            suggestions.add("Consider adding experience with " + keyword + ".");
        }
        return suggestions;
    }
}

