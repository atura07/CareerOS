package com.careeros.resume;

import com.careeros.user.User;
import com.careeros.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserRepository userRepository;

    public ResumeController(ResumeService resumeService, UserRepository userRepository) {
        this.resumeService = resumeService;
        this.userRepository = userRepository;
    }

    /**
     * Upload a resume file.
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = resolveUserId(paramUserId, principal, authentication);
        log.info("POST /api/v1/resume/upload — userId={}, fileName={}, size={}",
                userId, file.getOriginalFilename(), file.getSize());

        ResumeResponse response = resumeService.uploadResume(file, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * List all resumes for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getUserResumes(
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = resolveUserId(paramUserId, principal, authentication);
        log.info("GET /api/v1/resume — userId={}", userId);
        List<ResumeResponse> resumes = resumeService.getUserResumes(userId);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Get a single resume by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResume(
            @PathVariable Long id,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = resolveUserId(paramUserId, principal, authentication);
        log.info("GET /api/v1/resume/{} — userId={}", id, userId);
        ResumeResponse response = resumeService.getResume(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a resume by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable Long id,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = resolveUserId(paramUserId, principal, authentication);
        log.info("DELETE /api/v1/resume/{} — userId={}", id, userId);
        resumeService.deleteResume(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Long resolveUserId(Long paramUserId, Object principal, Authentication authentication) {
        if (principal instanceof User user) {
            return user.getId();
        }
        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .map(User::getId)
                    .orElse(paramUserId != null ? paramUserId : 1L);
        }
        if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            return userRepository.findByEmail(authentication.getName())
                    .map(User::getId)
                    .orElse(paramUserId != null ? paramUserId : 1L);
        }
        return paramUserId != null ? paramUserId : 1L;
    }
}

