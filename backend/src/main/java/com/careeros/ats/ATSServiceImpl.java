package com.careeros.ats;

import com.careeros.ats.dto.AtsDetailedResponseDto;
import com.careeros.ats.dto.AtsJobAnalysisRequestDto;
import com.careeros.ats.engine.DeterministicAtsScorer;
import com.careeros.ats.entity.AtsAnalysisEntity;
import com.careeros.ats.repository.AtsAnalysisRepository;
import com.careeros.ats.service.AtsAiSuggestionService;
import com.careeros.resume.ResumeEntity;
import com.careeros.resume.ResumeNotFoundException;
import com.careeros.resume.ResumeRepository;
import com.careeros.resume.ResumeService;
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
    private final DeterministicAtsScorer deterministicAtsScorer;
    private final AtsAiSuggestionService atsAiSuggestionService;
    private final ExtractionQualityValidator extractionQualityValidator;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public AtsDetailedResponseDto getOverallAnalysis(Long resumeId, Long userId) {
        log.info("[ATS] getOverallAnalysis for resumeId={}, userId={}", resumeId, userId);

        ResumeEntity resume = fetchAndValidateResume(resumeId, userId);

        // Multi-stage extraction healing if text is missing, empty, or previously marked as failed
        resume = resumeService.healExtractedTextIfNecessary(resume);
        String extractedText = resume.getExtractedText();

        if (extractedText == null || extractedText.isBlank() || extractedText.startsWith("[Parsing failed")) {
            log.warn("[ATS] Unreadable resume text for resumeId={}", resumeId);
            return AtsDetailedResponseDto.builder()
                    .analysisMode("OVERALL")
                    .resumeId(resumeId)
                    .extractionStatus(ExtractionStatus.FAILED.name())
                    .extractionMethod("NONE")
                    .extractionConfidence(0.0)
                    .overallScore(0)
                    .readinessLevel("Needs significant improvement")
                    .summary("We could not extract readable text from this resume. All text and OCR extraction stages failed. Please upload a clear PDF or DOCX.")
                    .breakdown(Collections.emptyList())
                    .matchedSkills(Collections.emptyList())
                    .missingSkills(Collections.emptyList())
                    .additionalResumeSkills(Collections.emptyList())
                    .matchedKeywords(Collections.emptyList())
                    .missingKeywords(Collections.emptyList())
                    .keywordMatchPercentage(0.0)
                    .strengths(Collections.emptyList())
                    .improvements(List.of("Upload a clean, text-based PDF or DOCX file to enable full ATS analysis."))
                    .warnings(List.of("Unreadable document or corrupted file detected."))
                    .analyzedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .build();
        }

        // Check for cached overall analysis
        Optional<AtsAnalysisEntity> cachedOpt = atsAnalysisRepository
                .findFirstByResumeIdAndAnalysisModeOrderByCreatedAtDesc(resumeId, "OVERALL");

        if (cachedOpt.isPresent()) {
            AtsAnalysisEntity cached = cachedOpt.get();
            if (cached.getCreatedAt() != null && cached.getOverallScore() != null) {
                log.info("[ATS] Returning cached overall analysis for resumeId={}", resumeId);
                return mapEntityToDto(cached);
            }
        }

        // Assess extraction quality
        ExtractionQualityValidator.QualityAssessment quality = extractionQualityValidator.assess(extractedText);
        String extractionMethod = "docx".equalsIgnoreCase(resume.getFileType()) ? "POI_DOCX" : "PDFBOX_DIRECT";
        if (quality.status() == ExtractionStatus.OCR_USED) {
            extractionMethod = "OCR_FALLBACK";
        }

        // Perform deterministic analysis
        DeterministicAtsScorer.OverallScoreResult scoreResult = deterministicAtsScorer.scoreOverallResume(extractedText);

        // Enrich suggestions with AI if available
        List<String> contextualSuggestions = atsAiSuggestionService.generateContextualSuggestions(
                scoreResult.overallScore(),
                null,
                new ArrayList<>(scoreResult.skillsResult().getNormalizedSkills()),
                Collections.emptyList(),
                scoreResult.breakdown(),
                scoreResult.improvements()
        );

        String summary = scoreResult.readinessLevel() + " (" + scoreResult.overallScore() + "/100). "
                + (scoreResult.strengths().isEmpty() ? "Add measurable achievements to boost your score." : scoreResult.strengths().get(0));

        // Persist to database
        AtsAnalysisEntity entity = AtsAnalysisEntity.builder()
                .userId(userId)
                .resumeId(resumeId)
                .analysisMode("OVERALL")
                .extractionStatus(quality.status().name())
                .extractionMethod(extractionMethod)
                .extractionConfidence(quality.confidence())
                .overallScore(scoreResult.overallScore())
                .completenessScore(scoreResult.completenessScore())
                .atsCompatibilityScore(scoreResult.atsCompatibilityScore())
                .skillsScore(scoreResult.skillsScore())
                .experienceScore(scoreResult.experienceScore())
                .impactScore(scoreResult.impactScore())
                .languageScore(scoreResult.languageScore())
                .matchedSkillsJson(toJson(new ArrayList<>(scoreResult.skillsResult().getNormalizedSkills())))
                .missingSkillsJson(toJson(Collections.emptyList()))
                .additionalSkillsJson(toJson(new ArrayList<>(scoreResult.skillsResult().getNormalizedSkills())))
                .matchedKeywordsJson(toJson(Collections.emptyList()))
                .missingKeywordsJson(toJson(Collections.emptyList()))
                .breakdownJson(toJson(scoreResult.breakdown()))
                .strengthsJson(toJson(scoreResult.strengths()))
                .improvementsJson(toJson(contextualSuggestions))
                .warningsJson(toJson(scoreResult.warnings()))
                .summary(summary)
                .build();

        AtsAnalysisEntity saved = atsAnalysisRepository.save(entity);
        log.info("[ATS] Saved overall ATS analysis id={} for resumeId={}", saved.getId(), resumeId);

        return mapEntityToDto(saved);
    }

    @Override
    @Transactional
    public AtsDetailedResponseDto analyzeJobMatch(Long resumeId, Long userId, AtsJobAnalysisRequestDto request) {
        log.info("[ATS] analyzeJobMatch for resumeId={}, userId={}, jobTitle={}",
                resumeId, userId, request != null ? request.getJobTitle() : "N/A");

        ResumeEntity resume = fetchAndValidateResume(resumeId, userId);
        resume = resumeService.healExtractedTextIfNecessary(resume);
        String extractedText = resume.getExtractedText();

        if (request == null || request.getJobDescription() == null || request.getJobDescription().trim().isBlank()) {
            throw new IllegalArgumentException("Job Description is required for job-specific match analysis.");
        }

        String rawJd = request.getJobDescription().trim();
        String jdHash = hashSha256(rawJd);

        // Check for cached analysis of identical resume + JD
        Optional<AtsAnalysisEntity> cachedOpt = atsAnalysisRepository
                .findFirstByResumeIdAndAnalysisModeAndJobDescriptionHash(resumeId, "JOB_SPECIFIC", jdHash);

        if (cachedOpt.isPresent()) {
            log.info("[ATS] Returning cached job match analysis for resumeId={} and jdHash={}", resumeId, jdHash);
            return mapEntityToDto(cachedOpt.get());
        }

        // Assess extraction quality
        ExtractionQualityValidator.QualityAssessment quality = extractionQualityValidator.assess(extractedText);
        String extractionMethod = "docx".equalsIgnoreCase(resume.getFileType()) ? "POI_DOCX" : "PDFBOX_DIRECT";
        if (quality.status() == ExtractionStatus.OCR_USED) {
            extractionMethod = "OCR_FALLBACK";
        }

        // Perform deterministic analysis for both Overall and Job Match
        DeterministicAtsScorer.OverallScoreResult overallResult = deterministicAtsScorer.scoreOverallResume(extractedText);
        DeterministicAtsScorer.JobMatchResult jobResult = deterministicAtsScorer.scoreJobMatch(extractedText, rawJd);

        // Enrich suggestions with AI
        List<String> contextualSuggestions = atsAiSuggestionService.generateContextualSuggestions(
                overallResult.overallScore(),
                jobResult.jobMatchScore(),
                jobResult.matchedSkills(),
                jobResult.missingSkills(),
                jobResult.breakdown(),
                jobResult.improvements()
        );

        String summary = String.format("%s (%d/100) for %s%s. Matched %d key technical skills.",
                jobResult.matchLevel(),
                jobResult.jobMatchScore(),
                request.getJobTitle() != null && !request.getJobTitle().isBlank() ? request.getJobTitle() : "Target Role",
                request.getCompanyName() != null && !request.getCompanyName().isBlank() ? " at " + request.getCompanyName() : "",
                jobResult.matchedSkills().size()
        );

        AtsAnalysisEntity entity = AtsAnalysisEntity.builder()
                .userId(userId)
                .resumeId(resumeId)
                .analysisMode("JOB_SPECIFIC")
                .jobTitle(request.getJobTitle())
                .companyName(request.getCompanyName())
                .jobDescriptionHash(jdHash)
                .extractionStatus(quality.status().name())
                .extractionMethod(extractionMethod)
                .extractionConfidence(quality.confidence())
                .overallScore(overallResult.overallScore())
                .jobMatchScore(jobResult.jobMatchScore())
                .completenessScore(overallResult.completenessScore())
                .atsCompatibilityScore(overallResult.atsCompatibilityScore())
                .skillsScore(overallResult.skillsScore())
                .experienceScore(overallResult.experienceScore())
                .impactScore(overallResult.impactScore())
                .languageScore(overallResult.languageScore())
                .requiredSkillsScore(jobResult.requiredSkillsScore())
                .keywordScore(jobResult.keywordScore())
                .responsibilityScore(jobResult.responsibilityScore())
                .eligibilityScore(jobResult.eligibilityScore())
                .semanticScore(jobResult.semanticScore())
                .matchedSkillsJson(toJson(jobResult.matchedSkills()))
                .missingSkillsJson(toJson(jobResult.missingSkills()))
                .additionalSkillsJson(toJson(jobResult.additionalResumeSkills()))
                .matchedKeywordsJson(toJson(jobResult.matchedKeywords()))
                .missingKeywordsJson(toJson(jobResult.missingKeywords()))
                .breakdownJson(toJson(jobResult.breakdown()))
                .strengthsJson(toJson(jobResult.strengths()))
                .improvementsJson(toJson(contextualSuggestions))
                .warningsJson(toJson(overallResult.warnings()))
                .summary(summary)
                .build();

        AtsAnalysisEntity saved = atsAnalysisRepository.save(entity);
        log.info("[ATS] Saved job-specific ATS analysis id={} for resumeId={}", saved.getId(), resumeId);

        return mapEntityToDto(saved);
    }

    @Override
    @Transactional
    public ATSAnalysisResponse analyze(Long resumeId, String jobDescription) {
        log.info("[ATS] Legacy analyze called for resumeId={}", resumeId);
        Long userId = 1L;
        Optional<ResumeEntity> rOpt = resumeRepository.findById(resumeId);
        if (rOpt.isPresent()) {
            userId = rOpt.get().getUserId();
        }

        AtsJobAnalysisRequestDto req = AtsJobAnalysisRequestDto.builder()
                .jobDescription(jobDescription)
                .build();

        AtsDetailedResponseDto detailed = analyzeJobMatch(resumeId, userId, req);

        return new ATSAnalysisResponse(
                detailed.getJobMatchScore() != null ? detailed.getJobMatchScore() : detailed.getOverallScore(),
                detailed.getMatchedSkills() != null && !detailed.getMatchedSkills().isEmpty() ? detailed.getMatchedSkills() : detailed.getMatchedKeywords(),
                detailed.getMissingSkills() != null && !detailed.getMissingSkills().isEmpty() ? detailed.getMissingSkills() : detailed.getMissingKeywords(),
                detailed.getImprovements()
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

    private AtsDetailedResponseDto mapEntityToDto(AtsAnalysisEntity entity) {
        List<AtsDetailedResponseDto.CategoryBreakdownDto> breakdown = fromJson(
                entity.getBreakdownJson(), new TypeReference<List<AtsDetailedResponseDto.CategoryBreakdownDto>>() {});
        List<String> matchedSkills = fromJson(entity.getMatchedSkillsJson(), new TypeReference<List<String>>() {});
        List<String> missingSkills = fromJson(entity.getMissingSkillsJson(), new TypeReference<List<String>>() {});
        List<String> additionalSkills = fromJson(entity.getAdditionalSkillsJson(), new TypeReference<List<String>>() {});
        List<String> matchedKeywords = fromJson(entity.getMatchedKeywordsJson(), new TypeReference<List<String>>() {});
        List<String> missingKeywords = fromJson(entity.getMissingKeywordsJson(), new TypeReference<List<String>>() {});
        List<String> strengths = fromJson(entity.getStrengthsJson(), new TypeReference<List<String>>() {});
        List<String> improvements = fromJson(entity.getImprovementsJson(), new TypeReference<List<String>>() {});
        List<String> warnings = fromJson(entity.getWarningsJson(), new TypeReference<List<String>>() {});

        String readinessLevel = "Strong ATS readiness";
        if (entity.getOverallScore() != null) {
            int score = entity.getOverallScore();
            if (score >= 85) readinessLevel = "Excellent ATS readiness";
            else if (score >= 75) readinessLevel = "Strong ATS readiness";
            else if (score >= 60) readinessLevel = "Good foundation";
            else if (score >= 40) readinessLevel = "Basic ATS readiness";
            else readinessLevel = "Needs significant improvement";
        }

        String matchLevel = null;
        if (entity.getJobMatchScore() != null) {
            int jScore = entity.getJobMatchScore();
            if (jScore >= 85) matchLevel = "Excellent Job Match";
            else if (jScore >= 75) matchLevel = "Strong Job Match";
            else if (jScore >= 60) matchLevel = "Good Job Match";
            else if (jScore >= 40) matchLevel = "Basic Job Match";
            else matchLevel = "Low Job Match";
        }

        double kwPercentage = 0.0;
        int totalKw = (matchedKeywords != null ? matchedKeywords.size() : 0) + (missingKeywords != null ? missingKeywords.size() : 0);
        if (totalKw > 0 && matchedKeywords != null) {
            kwPercentage = Math.round(((double) matchedKeywords.size() / totalKw) * 100.0 * 10.0) / 10.0;
        }

        return AtsDetailedResponseDto.builder()
                .analysisMode(entity.getAnalysisMode())
                .resumeId(entity.getResumeId())
                .jobTitle(entity.getJobTitle())
                .companyName(entity.getCompanyName())
                .extractionStatus(entity.getExtractionStatus())
                .extractionMethod(entity.getExtractionMethod())
                .extractionConfidence(entity.getExtractionConfidence())
                .overallScore(entity.getOverallScore() != null ? entity.getOverallScore() : 0)
                .readinessLevel(readinessLevel)
                .jobMatchScore(entity.getJobMatchScore())
                .matchLevel(matchLevel)
                .summary(entity.getSummary())
                .breakdown(breakdown != null ? breakdown : Collections.emptyList())
                .matchedSkills(matchedSkills != null ? matchedSkills : Collections.emptyList())
                .missingSkills(missingSkills != null ? missingSkills : Collections.emptyList())
                .additionalResumeSkills(additionalSkills != null ? additionalSkills : Collections.emptyList())
                .matchedKeywords(matchedKeywords != null ? matchedKeywords : Collections.emptyList())
                .missingKeywords(missingKeywords != null ? missingKeywords : Collections.emptyList())
                .keywordMatchPercentage(kwPercentage)
                .strengths(strengths != null ? strengths : Collections.emptyList())
                .improvements(improvements != null ? improvements : Collections.emptyList())
                .warnings(warnings != null ? warnings : Collections.emptyList())
                .analyzedAt(entity.getCreatedAt() != null
                        ? entity.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
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
            log.error("[ATS] Failed to serialize JSON: {}", e.getMessage());
            return "[]";
        }
    }

    private <T> T fromJson(String json, TypeReference<T> typeRef) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, typeRef);
        } catch (Exception e) {
            log.debug("[ATS] Failed to deserialize JSON: {}", e.getMessage());
            return null;
        }
    }
}
