package com.careeros.ats;

import java.util.List;

/**
 * Response DTO for the JD-based ATS analysis endpoint.
 * <p>
 * Contains the match score, lists of matched and missing keywords,
 * and actionable suggestions for improving the resume against the
 * provided job description.
 */
public class ATSAnalysisResponse {

    private int score;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> suggestions;

    public ATSAnalysisResponse() {}

    public ATSAnalysisResponse(int score, List<String> matchedKeywords,
                               List<String> missingKeywords, List<String> suggestions) {
        this.score = score;
        this.matchedKeywords = matchedKeywords;
        this.missingKeywords = missingKeywords;
        this.suggestions = suggestions;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getMatchedKeywords() {
        return matchedKeywords;
    }

    public void setMatchedKeywords(List<String> matchedKeywords) {
        this.matchedKeywords = matchedKeywords;
    }

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(List<String> missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}

