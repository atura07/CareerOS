package com.careeros.ats;

import com.careeros.resume.ResumeResponse;
import com.careeros.resume.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for ATS resume analysis.
 * <p>
 * Endpoints:
 *   GET /api/v1/ats/analyze/{resumeId} — Analyze an already-uploaded resume by ID
 *   POST /api/v1/ats/analyze/text      — Analyze raw extracted text directly
 */
@RestController
@RequestMapping("/api/v1/ats")
public class AtsController {

    private static final Logger log = LoggerFactory.getLogger(AtsController.class);

    private final AtsService atsService;
    private final ResumeService resumeService;

    public AtsController(AtsService atsService, ResumeService resumeService) {
        this.atsService = atsService;
        this.resumeService = resumeService;
    }

    /**
     * Analyze a previously uploaded resume by its ID.
     * <p>
     * Fetches the resume from ResumeService to get the extracted text,
     * then runs the ATS analysis pipeline.
     *
     * @param resumeId the ID of the uploaded resume
     * @param userId   temporary — will be extracted from JWT
     * @return AtsResponse with score, keywords, sections, and suggestions
     */
    @GetMapping("/analyze/{resumeId}")
    public ResponseEntity<AtsResponse> analyzeResumeById(
            @PathVariable Long resumeId,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {

        log.info("GET /api/v1/ats/analyze/{} — userId={}", resumeId, userId);

        // Fetch the resume to get extracted text
        ResumeResponse resume = resumeService.getResume(resumeId, userId);

        // Run ATS analysis on the extracted text
        AtsResponse response = atsService.analyzeText(resume.getExtractedText());

        return ResponseEntity.ok(response);
    }

    /**
     * Analyze raw extracted text directly.
     * <p>
     * Useful for testing or when the text is already available
     * without needing a file upload.
     *
     * @param request body containing the extracted text
     * @return AtsResponse with score, keywords, sections, and suggestions
     */
    @PostMapping("/analyze/text")
    public ResponseEntity<AtsResponse> analyzeText(
            @RequestBody AnalyzeTextRequest request) {

        log.info("POST /api/v1/ats/analyze/text — textLength={}",
                request.text() != null ? request.text().length() : 0);

        AtsResponse response = atsService.analyzeText(request.text());
        return ResponseEntity.ok(response);
    }

    /**
     * Simple request record for text analysis endpoint.
     */
    public record AnalyzeTextRequest(String text) {}
}

