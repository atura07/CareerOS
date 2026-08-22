package com.careeros.ats;

import com.careeros.ats.dto.AtsDetailedResponseDto;
import com.careeros.ats.dto.AtsJobAnalysisRequestDto;
import com.careeros.resume.ResumeResponse;
import com.careeros.resume.ResumeService;
import com.careeros.user.User;
import com.careeros.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ats")
public class AtsController {

    private static final Logger log = LoggerFactory.getLogger(AtsController.class);

    private final AtsService atsService;
    private final ResumeService resumeService;
    private final AtsAnalysisService atsAnalysisService;
    private final UserRepository userRepository;

    public AtsController(AtsService atsService,
                         ResumeService resumeService,
                         AtsAnalysisService atsAnalysisService,
                         UserRepository userRepository) {
        this.atsService = atsService;
        this.resumeService = resumeService;
        this.atsAnalysisService = atsAnalysisService;
        this.userRepository = userRepository;
    }

    /**
     * MODE 1: Get or calculate deterministic Overall ATS Readiness Score for a resume.
     */
    @GetMapping("/resumes/{resumeId}/overall")
    public ResponseEntity<AtsDetailedResponseDto> getOverallAts(
            @PathVariable Long resumeId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = resolveUserId(principal, authentication);
        log.info("GET /api/v1/ats/resumes/{}/overall — userId={}", resumeId, userId);

        AtsDetailedResponseDto response = atsAnalysisService.getOverallAnalysis(resumeId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * MODE 2: Analyze resume against a specific Job Description.
     */
    @PostMapping("/resumes/{resumeId}/analyze-job")
    public ResponseEntity<AtsDetailedResponseDto> analyzeJobMatch(
            @PathVariable Long resumeId,
            @RequestBody AtsJobAnalysisRequestDto request,
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = resolveUserId(principal, authentication);
        log.info("POST /api/v1/ats/resumes/{}/analyze-job — userId={}, jobTitle={}",
                resumeId, userId, request != null ? request.getJobTitle() : "N/A");

        AtsDetailedResponseDto response = atsAnalysisService.analyzeJobMatch(resumeId, userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Backward-compatible legacy endpoint: Analyze a resume by ID.
     */
    @GetMapping("/analyze/{resumeId}")
    public ResponseEntity<AtsResponse> analyzeResumeById(
            @PathVariable Long resumeId,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = paramUserId != null ? paramUserId : resolveUserId(principal, authentication);
        log.info("GET /api/v1/ats/analyze/{} — userId={}", resumeId, userId);

        ResumeResponse resume = resumeService.getResume(resumeId, userId != null ? userId : 1L);
        AtsResponse response = atsService.analyzeText(resume.getExtractedText());
        response.setResumeId(resumeId);

        return ResponseEntity.ok(response);
    }

    /**
     * Backward-compatible legacy endpoint: Analyze raw text directly.
     */
    @PostMapping("/analyze/text")
    public ResponseEntity<AtsResponse> analyzeText(@RequestBody AnalyzeTextRequest request) {
        log.info("POST /api/v1/ats/analyze/text — textLength={}",
                request.text() != null ? request.text().length() : 0);

        AtsResponse response = atsService.analyzeText(request.text());
        return ResponseEntity.ok(response);
    }

    /**
     * Backward-compatible legacy endpoint: Analyze resume against job description.
     */
    @PostMapping(value = {"/api/ats/analyze", "/analyze-job-legacy"})
    public ResponseEntity<ATSAnalysisResponse> analyzeResumeAgainstJobDescription(
            @RequestBody ATSAnalysisRequest request) {

        log.info("POST /api/v1/ats/api/ats/analyze — resumeId={}", request.getResumeId());

        ATSAnalysisResponse response = atsAnalysisService.analyze(
                request.getResumeId(),
                request.getJobDescription()
        );

        return ResponseEntity.ok(response);
    }

    private Long resolveUserId(Object principal, Authentication authentication) {
        if (principal instanceof User user) {
            return user.getId();
        }
        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .map(User::getId)
                    .orElse(1L);
        }
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName())
                    .map(User::getId)
                    .orElse(1L);
        }
        return 1L;
    }

    public record AnalyzeTextRequest(String text) {}
}
