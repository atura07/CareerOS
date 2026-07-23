package com.careeros.resume;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for resume upload and management.
 *
 * Endpoints:
 *   POST   /api/v1/resume/upload  — Upload a resume (PDF/DOCX)
 *   GET    /api/v1/resume         — List all resumes for the user
 *   GET    /api/v1/resume/{id}    — Get a single resume by ID
 *   DELETE /api/v1/resume/{id}    — Delete a resume by ID
 */
@RestController
@RequestMapping("/api/v1/resume")
public class ResumeController {

    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Upload a resume file.
     *
     * Request: multipart/form-data with field name "file"
     * Accepts: PDF and DOCX only, max 5 MB
     *
     * @param file   the uploaded resume file
     * @param userId temporary — will be extracted from JWT once auth is integrated
     * @return ResumeResponse with metadata and extracted text
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {

        log.info("POST /api/v1/resume/upload — userId={}, fileName={}, size={}",
                userId, file.getOriginalFilename(), file.getSize());

        ResumeResponse response = resumeService.uploadResume(file, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * List all resumes for the authenticated user.
     *
     * @param userId temporary — will be extracted from JWT
     * @return list of ResumeResponse
     */
    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getUserResumes(
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {

        log.info("GET /api/v1/resume — userId={}", userId);
        List<ResumeResponse> resumes = resumeService.getUserResumes(userId);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Get a single resume by ID.
     *
     * @param id     resume ID
     * @param userId temporary — will be extracted from JWT
     * @return ResumeResponse
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResume(
            @PathVariable Long id,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {

        log.info("GET /api/v1/resume/{} — userId={}", id, userId);
        ResumeResponse response = resumeService.getResume(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a resume by ID.
     *
     * @param id     resume ID
     * @param userId temporary — will be extracted from JWT
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable Long id,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {

        log.info("DELETE /api/v1/resume/{} — userId={}", id, userId);
        resumeService.deleteResume(id, userId);
        return ResponseEntity.noContent().build();
    }
}

