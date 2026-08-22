package com.careeros.ats;

import com.careeros.ats.dto.*;

import java.util.List;

/**
 * Service interface for SaaS-grade Resume Intelligence & ATS analysis.
 */
public interface AtsAnalysisService {

    /**
     * MODE 1: Universal ATS Check with role-based benchmarking and explainable 7-category breakdown.
     */
    AtsIntelligenceDto getUniversalIntelligence(Long resumeId, Long userId, String targetRole);

    /**
     * MODE 2: Job-Specific ATS Match against target Job Description.
     */
    AtsIntelligenceDto analyzeJobMatchIntelligence(Long resumeId, Long userId, AtsJobAnalysisRequestDto request);

    /**
     * Interactive Bullet Point Improver.
     */
    BulletImprovementResponseDto improveBullet(BulletImprovementRequestDto request);

    /**
     * Get real historical analysis timeline for a resume.
     */
    List<AtsIntelligenceDto> getResumeAnalysisHistory(Long resumeId, Long userId);

    /**
     * Backward-compatible Mode 1 overall analysis.
     */
    AtsDetailedResponseDto getOverallAnalysis(Long resumeId, Long userId);

    /**
     * Backward-compatible Mode 2 job analysis.
     */
    AtsDetailedResponseDto analyzeJobMatch(Long resumeId, Long userId, AtsJobAnalysisRequestDto request);

    /**
     * Legacy / backward-compatible analyze method.
     */
    ATSAnalysisResponse analyze(Long resumeId, String jobDescription);
}
