package com.careeros.ats;

import com.careeros.ats.dto.AtsDetailedResponseDto;
import com.careeros.ats.dto.AtsJobAnalysisRequestDto;

/**
 * Service interface for Hybrid ATS analysis (Overall and Job-Specific modes).
 */
public interface AtsAnalysisService {

    /**
     * Calculate or retrieve latest deterministic Overall ATS Readiness for a user's resume.
     */
    AtsDetailedResponseDto getOverallAnalysis(Long resumeId, Long userId);

    /**
     * Calculate targeted ATS Job Match against a provided Job Description.
     */
    AtsDetailedResponseDto analyzeJobMatch(Long resumeId, Long userId, AtsJobAnalysisRequestDto request);

    /**
     * Legacy / backward-compatible analyze method.
     */
    ATSAnalysisResponse analyze(Long resumeId, String jobDescription);
}
