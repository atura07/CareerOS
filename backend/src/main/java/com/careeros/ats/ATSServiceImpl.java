package com.careeros.ats;

import com.careeros.ats.dto.*;
import com.careeros.ats.engine.BulletImprovementEngine;
import com.careeros.ats.engine.DeterministicAtsScorer;
import com.careeros.ats.engine.JobMatchIntelligenceEngine;
import com.careeros.ats.engine.UniversalAtsIntelligenceEngine;
import com.careeros.ats.entity.AtsAnalysisEntity;
import com.careeros.ats.repository.AtsAnalysisRepository;
import com.careeros.ats.service.AtsAiSuggestionService;
import com.careeros.resume.ResumeEntity;
import com.careeros.resume.ResumeNotFoundException;
import com.careeros.resume.ResumeRepository;
import com.careeros.resume.ResumeService;
import com.careeros.resume.extraction.ExtractedResumeContent;
import com.careeros.resume.extraction.ExtractionQualityValidator;
import com.careeros.resume.extraction.ExtractionStatus;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ATSServiceImpl implements AtsAnalysisService {

    private final ResumeRepository resumeRepository;
    private final ResumeService resumeService;
    private final AtsAnalysisRepository atsAnalysisRepository;
    private final UniversalAtsIntelligenceEngine universalAtsEngine;
    private final JobMatchIntelligenceEngine jobMatchEngine;
    private final BulletImprovementEngine bulletImprovementEngine;
    private final DeterministicAtsScorer deterministicAtsScorer;
    private final AtsAiSuggestionService atsAiSuggestionService;
    private final ExtractionQualityValidator extractionQualityValidator;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public AtsIntelligenceDto getUniversalIntelligence(Long resumeId, Long userId, String targetRole) {
        log.info("[ATS-INTELLIGENCE] getUniversalIntelligence resumeId={}, userId={}, role={}", resumeId, userId, targetRole);

        ResumeEntity resume = fetchAndValidateResume(resumeId, userId);
        resume = resumeService.healExtractedTextIfNecessary(resume);
        String extractedText = resume.getExtractedText();

        String cleanTargetRole = (targetRole != null && !targetRole.trim().isBlank()) ? targetRole.trim() : "Software Engineer";

        // 1. Build Extraction Telemetry
        ExtractionQualityValidator.QualityAssessment quality = extractionQualityValidator.assess(extractedText);
        String extractionMethod = "docx".equalsIgnoreCase(resume.getFileType()) ? "POI_DOCX" : "PDFBOX_DIRECT";
        if (quality.status() == ExtractionStatus.OCR_USED) {
            extractionMethod = "OCR_FALLBACK";
        }

        ExtractedResumeContent telemetry = ExtractedResumeContent.builder()
                .rawText(extractedText != null ? extractedText : "")
                .cleanText(extractedText != null ? extractedText : "")
                .characterCount(extractedText != null ? extractedText.length() : 0)
                .wordCount(quality.wordCount())
                .alphaRatio(quality.alphaRatio())
                .extractionStatus(quality.status())
                .extractionMethod(com.careeros.resume.extraction.ExtractionMethod.valueOf(extractionMethod))
                .confidenceScore(quality.confidence())
                .detectedSections(quality.detectedSections())
                .warnings(quality.warnings())
                .build();

        // 2. Perform Universal 7-Category Evaluation
        UniversalAtsIntelligenceEngine.UniversalAnalysisResult result = universalAtsEngine.analyze(extractedText, telemetry, cleanTargetRole);

        // 3. Compute Real Historical Comparison (if previous analysis exists)
        List<AtsAnalysisEntity> pastAnalyses = atsAnalysisRepository.findTop2ByResumeIdAndAnalysisModeOrderByCreatedAtDesc(resumeId, "UNIVERSAL");
        AtsIntelligenceDto.HistoryComparisonDto historyComparison = null;

        if (!pastAnalyses.isEmpty()) {
            AtsAnalysisEntity previous = pastAnalyses.get(0);
            if (previous.getOverallScore() != null) {
                int delta = result.overallScore() - previous.getOverallScore();
                List<String> improvements = new ArrayList<>();
                List<String> regressions = new ArrayList<>();
                List<String> unchanged = new ArrayList<>();

                if (delta > 0) improvements.add("Overall ATS Compatibility improved by +" + delta + " points.");
                else if (delta < 0) regressions.add("Overall ATS Compatibility shifted by " + delta + " points.");
                else unchanged.add("Score remained consistent across recent revisions.");

                historyComparison = AtsIntelligenceDto.HistoryComparisonDto.builder()
                        .previousOverallScore(previous.getOverallScore())
                        .scoreDelta(delta)
                        .previousAnalyzedAt(previous.getCreatedAt() != null ? previous.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "")
                        .improvements(improvements)
                        .regressions(regressions)
                        .unchanged(unchanged)
                        .build();
            }
        }

        // 4. Persist Analysis Entity
        AtsAnalysisEntity entity = AtsAnalysisEntity.builder()
                .userId(userId)
                .resumeId(resumeId)
                .analysisMode("UNIVERSAL")
                .targetRole(cleanTargetRole)
                .analysisStatus(result.analysisStatus())
                .extractionStatus(quality.status().name())
                .extractionMethod(extractionMethod)
                .extractionConfidence(quality.confidence())
                .confidenceScore(result.confidence())
                .overallScore(result.overallScore())
                .scoreLabel(result.scoreLabel())
                .parsabilityScore(getCatScore(result.categories(), "Parsability & Document Health"))
                .completenessScore(getCatScore(result.categories(), "Core Section Completeness"))
                .contactScore(getCatScore(result.categories(), "Contact & Professional Identity"))
                .skillsScore(getCatScore(result.categories(), "Skills & Technical Signals"))
                .experienceScore(getCatScore(result.categories(), "Experience & Project Quality"))
                .readabilityScore(getCatScore(result.categories(), "Readability & ATS Safety"))
                .achievementsScore(getCatScore(result.categories(), "Achievements & Profile Strength"))
                .breakdownJson(toJson(result.categories()))
                .strengthsJson(toJson(result.strengths()))
                .improvementsJson(toJson(result.detailedRecommendations()))
                .quickWinsJson(toJson(result.quickWins()))
                .matchedSkillsJson(toJson(result.keywordIntelligence().getMatched()))
                .missingSkillsJson(toJson(result.keywordIntelligence().getMissing()))
                .summary(result.summary().getDescription())
                .build();

        AtsAnalysisEntity saved = atsAnalysisRepository.save(entity);
        log.info("[ATS-INTELLIGENCE] Saved universal analysis id={} for resumeId={}", saved.getId(), resumeId);

        String analyzedAtStr = (saved.getCreatedAt() != null)
                ? saved.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        // 5. Map to DTO
        return AtsIntelligenceDto.builder()
                .analysisId(String.valueOf(saved.getId()))
                .resumeId(resumeId)
                .mode("UNIVERSAL")
                .targetRole(cleanTargetRole)
                .analysisStatus(result.analysisStatus())
                .overallScore(result.overallScore())
                .scoreLabel(result.scoreLabel())
                .confidence(result.confidence())
                .confidenceMessage(result.confidenceMessage())
                .extraction(AtsIntelligenceDto.ExtractionTelemetryDto.builder()
                        .status(quality.status().name())
                        .method(extractionMethod)
                        .confidence(quality.confidence())
                        .characterCount(telemetry.getCharacterCount())
                        .wordCount(quality.wordCount())
                        .alphaRatio(quality.alphaRatio())
                        .build())
                .summary(result.summary())
                .scoreBreakdown(result.categories())
                .strengths(result.strengths())
                .criticalIssues(result.criticalIssues())
                .quickWins(result.quickWins())
                .detailedRecommendations(result.detailedRecommendations())
                .keywordAnalysis(result.keywordIntelligence())
                .historyComparison(historyComparison)
                .analyzedAt(analyzedAtStr)
                .build();
    }

    @Override
    @Transactional
    public AtsIntelligenceDto analyzeJobMatchIntelligence(Long resumeId, Long userId, AtsJobAnalysisRequestDto request) {
        log.info("[ATS-INTELLIGENCE] analyzeJobMatchIntelligence resumeId={}, userId={}, role={}",
                resumeId, userId, request != null ? request.getJobTitle() : "N/A");

        ResumeEntity resume = fetchAndValidateResume(resumeId, userId);
        resume = resumeService.healExtractedTextIfNecessary(resume);
        String extractedText = resume.getExtractedText();

        if (request == null || request.getJobDescription() == null || request.getJobDescription().trim().isBlank()) {
            throw new IllegalArgumentException("Job Description is required for job match analysis.");
        }

        String rawJd = request.getJobDescription().trim();
        String jdHash = hashSha256(rawJd);

        // 1. Run Universal baseline
        ExtractionQualityValidator.QualityAssessment quality = extractionQualityValidator.assess(extractedText);
        String extractionMethod = "docx".equalsIgnoreCase(resume.getFileType()) ? "POI_DOCX" : "PDFBOX_DIRECT";
        if (quality.status() == ExtractionStatus.OCR_USED) extractionMethod = "OCR_FALLBACK";

        ExtractedResumeContent telemetry = ExtractedResumeContent.builder()
                .cleanText(extractedText != null ? extractedText : "")
                .characterCount(extractedText != null ? extractedText.length() : 0)
                .wordCount(quality.wordCount())
                .alphaRatio(quality.alphaRatio())
                .extractionStatus(quality.status())
                .extractionMethod(com.careeros.resume.extraction.ExtractionMethod.valueOf(extractionMethod))
                .confidenceScore(quality.confidence())
                .build();

        UniversalAtsIntelligenceEngine.UniversalAnalysisResult universal = universalAtsEngine.analyze(
                extractedText, telemetry, request.getJobTitle());

        // 2. Run Job Match Engine
        JobMatchIntelligenceEngine.JobMatchResult jobMatch = jobMatchEngine.evaluate(
                extractedText, rawJd, request.getJobTitle(), request.getCompanyName());

        // 3. Persist Entity
        AtsAnalysisEntity entity = AtsAnalysisEntity.builder()
                .userId(userId)
                .resumeId(resumeId)
                .analysisMode("JOB_MATCH")
                .jobTitle(request.getJobTitle())
                .companyName(request.getCompanyName())
                .jobDescriptionHash(jdHash)
                .analysisStatus("ANALYSIS_COMPLETE")
                .extractionStatus(quality.status().name())
                .extractionMethod(extractionMethod)
                .extractionConfidence(quality.confidence())
                .confidenceScore(universal.confidence())
                .overallScore(universal.overallScore())
                .scoreLabel(universal.scoreLabel())
                .jobMatchScore(jobMatch.jobMatchScore())
                .requiredSkillsScore(jobMatch.requiredSkillsScore())
                .preferredSkillsScore(jobMatch.preferredSkillsScore())
                .experienceScore(jobMatch.experienceScore())
                .eligibilityScore(jobMatch.educationScore())
                .semanticScore(jobMatch.semanticScore())
                .matchedSkillsJson(toJson(jobMatch.matchedRequiredSkills()))
                .missingSkillsJson(toJson(jobMatch.missingRequiredSkills()))
                .breakdownJson(toJson(jobMatch.categories()))
                .strengthsJson(toJson(jobMatch.strengths()))
                .summary(jobMatch.summary().getDescription())
                .build();

        AtsAnalysisEntity saved = atsAnalysisRepository.save(entity);
        log.info("[ATS-INTELLIGENCE] Saved job match analysis id={} for resumeId={}", saved.getId(), resumeId);

        // 4. Build DTO
        AtsIntelligenceDto.JobMatchDetailsDto jobMatchDto = AtsIntelligenceDto.JobMatchDetailsDto.builder()
                .requiredSkillsScore(jobMatch.requiredSkillsScore())
                .preferredSkillsScore(jobMatch.preferredSkillsScore())
                .experienceScore(jobMatch.experienceScore())
                .educationScore(jobMatch.educationScore())
                .semanticScore(jobMatch.semanticScore())
                .matchedRequiredSkills(jobMatch.matchedRequiredSkills())
                .missingRequiredSkills(jobMatch.missingRequiredSkills())
                .matchedPreferredSkills(jobMatch.matchedPreferredSkills())
                .missingPreferredSkills(jobMatch.missingPreferredSkills())
                .build();

        return AtsIntelligenceDto.builder()
                .analysisId(String.valueOf(saved.getId()))
                .resumeId(resumeId)
                .mode("JOB_MATCH")
                .targetRole(request.getJobTitle())
                .analysisStatus("ANALYSIS_COMPLETE")
                .overallScore(universal.overallScore())
                .scoreLabel(universal.scoreLabel())
                .confidence(universal.confidence())
                .confidenceMessage(universal.confidenceMessage())
                .jobMatchScore(jobMatch.jobMatchScore())
                .matchLevel(jobMatch.matchLevel())
                .jobTitle(request.getJobTitle())
                .companyName(request.getCompanyName())
                .extraction(AtsIntelligenceDto.ExtractionTelemetryDto.builder()
                        .status(quality.status().name())
                        .method(extractionMethod)
                        .confidence(quality.confidence())
                        .characterCount(telemetry.getCharacterCount())
                        .wordCount(quality.wordCount())
                        .alphaRatio(quality.alphaRatio())
                        .build())
                .summary(jobMatch.summary())
                .scoreBreakdown(jobMatch.categories())
                .strengths(jobMatch.strengths())
                .criticalIssues(jobMatch.criticalIssues())
                .quickWins(universal.quickWins())
                .detailedRecommendations(universal.detailedRecommendations())
                .keywordAnalysis(AtsIntelligenceDto.KeywordIntelligenceDto.builder()
                        .matched(jobMatch.matchedRequiredSkills())
                        .missing(jobMatch.missingRequiredSkills())
                        .suggested(Collections.emptyList())
                        .keywordCoverage(jobMatch.matchedRequiredSkills().isEmpty() ? 0 :
                                ((double) jobMatch.matchedRequiredSkills().size() / (jobMatch.matchedRequiredSkills().size() + jobMatch.missingRequiredSkills().size())) * 100.0)
                        .build())
                .jobMatch(jobMatchDto)
                .analyzedAt(saved.getCreatedAt() != null ? saved.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    @Override
    public BulletImprovementResponseDto improveBullet(BulletImprovementRequestDto request) {
        return bulletImprovementEngine.improveBullet(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AtsIntelligenceDto> getResumeAnalysisHistory(Long resumeId, Long userId) {
        ResumeEntity resume = fetchAndValidateResume(resumeId, userId);
        List<AtsAnalysisEntity> entities = atsAnalysisRepository.findByResumeIdOrderByCreatedAtDesc(resumeId);

        return entities.stream().map(e -> AtsIntelligenceDto.builder()
                .analysisId(String.valueOf(e.getId()))
                .resumeId(e.getResumeId())
                .mode(e.getAnalysisMode())
                .targetRole(e.getTargetRole())
                .overallScore(e.getOverallScore() != null ? e.getOverallScore() : 0)
                .scoreLabel(e.getScoreLabel() != null ? e.getScoreLabel() : "Standard")
                .confidence(e.getConfidenceScore() != null ? e.getConfidenceScore() : 90)
                .jobMatchScore(e.getJobMatchScore())
                .summary(AtsIntelligenceDto.SummaryHeadlineDto.builder().description(e.getSummary()).build())
                .analyzedAt(e.getCreatedAt() != null ? e.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "")
                .build()).toList();
    }

    @Override
    @Transactional
    public AtsDetailedResponseDto getOverallAnalysis(Long resumeId, Long userId) {
        AtsIntelligenceDto intel = getUniversalIntelligence(resumeId, userId, "Software Engineer");
        return mapIntelToDetailedDto(intel);
    }

    @Override
    @Transactional
    public AtsDetailedResponseDto analyzeJobMatch(Long resumeId, Long userId, AtsJobAnalysisRequestDto request) {
        AtsIntelligenceDto intel = analyzeJobMatchIntelligence(resumeId, userId, request);
        return mapIntelToDetailedDto(intel);
    }

    @Override
    @Transactional
    public ATSAnalysisResponse analyze(Long resumeId, String jobDescription) {
        Long userId = 1L;
        Optional<ResumeEntity> rOpt = resumeRepository.findById(resumeId);
        if (rOpt.isPresent()) userId = rOpt.get().getUserId();

        AtsJobAnalysisRequestDto req = AtsJobAnalysisRequestDto.builder()
                .jobDescription(jobDescription)
                .build();

        AtsIntelligenceDto intel = analyzeJobMatchIntelligence(resumeId, userId, req);

        return new ATSAnalysisResponse(
                intel.getJobMatchScore() != null ? intel.getJobMatchScore() : intel.getOverallScore(),
                intel.getKeywordAnalysis() != null ? intel.getKeywordAnalysis().getMatched() : List.of(),
                intel.getKeywordAnalysis() != null ? intel.getKeywordAnalysis().getMissing() : List.of(),
                intel.getQuickWins()
        );
    }

    private ResumeEntity fetchAndValidateResume(Long resumeId, Long userId) {
        ResumeEntity resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + resumeId));

        if (userId != null && !userId.equals(resume.getUserId())) {
            log.warn("[ATS] Access denied: userId={} does not own resumeId={}", userId, resumeId);
            throw new AccessDeniedException("You do not have permission to analyze this resume.");
        }

        return resume;
    }

    private int getCatScore(List<AtsIntelligenceDto.CategoryDetailDto> list, String categoryName) {
        return list.stream().filter(c -> c.getCategory().equalsIgnoreCase(categoryName)).mapToInt(AtsIntelligenceDto.CategoryDetailDto::getScore).findFirst().orElse(0);
    }

    private AtsDetailedResponseDto mapIntelToDetailedDto(AtsIntelligenceDto intel) {
        List<AtsDetailedResponseDto.CategoryBreakdownDto> breakdown = intel.getScoreBreakdown().stream().map(c ->
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category(c.getCategory())
                        .score(c.getScore())
                        .maxScore(c.getMaxScore())
                        .percentage(Math.round(((double) c.getScore() / c.getMaxScore()) * 100.0))
                        .feedback(c.getReason())
                        .build()).toList();

        return AtsDetailedResponseDto.builder()
                .analysisMode(intel.getMode())
                .resumeId(intel.getResumeId())
                .jobTitle(intel.getJobTitle())
                .companyName(intel.getCompanyName())
                .extractionStatus(intel.getExtraction() != null ? intel.getExtraction().getStatus() : "GOOD")
                .extractionMethod(intel.getExtraction() != null ? intel.getExtraction().getMethod() : "PDFBOX_DIRECT")
                .extractionConfidence(intel.getExtraction() != null ? intel.getExtraction().getConfidence() : 0.95)
                .overallScore(intel.getOverallScore())
                .readinessLevel(intel.getScoreLabel())
                .jobMatchScore(intel.getJobMatchScore())
                .matchLevel(intel.getMatchLevel())
                .summary(intel.getSummary() != null ? intel.getSummary().getDescription() : "")
                .breakdown(breakdown)
                .matchedSkills(intel.getKeywordAnalysis() != null ? intel.getKeywordAnalysis().getMatched() : List.of())
                .missingSkills(intel.getKeywordAnalysis() != null ? intel.getKeywordAnalysis().getMissing() : List.of())
                .additionalResumeSkills(List.of())
                .matchedKeywords(intel.getKeywordAnalysis() != null ? intel.getKeywordAnalysis().getMatched() : List.of())
                .missingKeywords(intel.getKeywordAnalysis() != null ? intel.getKeywordAnalysis().getMissing() : List.of())
                .keywordMatchPercentage(intel.getKeywordAnalysis() != null ? intel.getKeywordAnalysis().getKeywordCoverage() : 0.0)
                .strengths(intel.getStrengths())
                .improvements(intel.getQuickWins())
                .warnings(List.of())
                .analyzedAt(intel.getAnalyzedAt())
                .build();
    }

    private String hashSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return String.valueOf(input.hashCode());
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }
}
