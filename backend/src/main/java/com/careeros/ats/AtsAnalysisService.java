package com.careeros.ats;

/**
 * Service interface for JD-based ATS analysis.
 * <p>
 * Defines the contract for analyzing a resume against a job description.
 * Implementations perform keyword extraction, matching, and scoring,
 * returning a structured analysis response.
 */
public interface AtsAnalysisService {

    /**
     * Analyze a resume against a job description.
     *
     * @param resumeId       the ID of the uploaded resume (matches ResumeEntity PK)
     * @param jobDescription the full job description text
     * @return ATSAnalysisResponse containing score, matched/missing keywords, and suggestions
     */
    ATSAnalysisResponse analyze(Long resumeId, String jobDescription);
}

