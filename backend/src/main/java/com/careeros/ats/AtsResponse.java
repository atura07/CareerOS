package com.careeros.ats;

import java.util.List;

/**
 * DTO returned to the client after ATS analysis.
 * Contains the score, keyword matches, detected sections, and suggestions.
 */
public class AtsResponse {

    private Long resumeId;
    private int overallScore;
    private List<KeywordMatch> keywordMatches;
    private List<String> detectedSections;
    private List<AtsSuggestion> suggestions;
    private String summary;

    public AtsResponse() {}

    public AtsResponse(int overallScore, List<KeywordMatch> keywordMatches,
                       List<String> detectedSections, List<AtsSuggestion> suggestions) {
        this.overallScore = overallScore;
        this.keywordMatches = keywordMatches;
        this.detectedSections = detectedSections;
        this.suggestions = suggestions;
    }

    public AtsResponse(Long resumeId, int overallScore, List<KeywordMatch> keywordMatches,
                       List<String> detectedSections, List<AtsSuggestion> suggestions) {
        this.resumeId = resumeId;
        this.overallScore = overallScore;
        this.keywordMatches = keywordMatches;
        this.detectedSections = detectedSections;
        this.suggestions = suggestions;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public List<KeywordMatch> getKeywordMatches() {
        return keywordMatches;
    }

    public void setKeywordMatches(List<KeywordMatch> keywordMatches) {
        this.keywordMatches = keywordMatches;
    }

    public List<String> getDetectedSections() {
        return detectedSections;
    }

    public void setDetectedSections(List<String> detectedSections) {
        this.detectedSections = detectedSections;
    }

    public List<AtsSuggestion> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<AtsSuggestion> suggestions) {
        this.suggestions = suggestions;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
