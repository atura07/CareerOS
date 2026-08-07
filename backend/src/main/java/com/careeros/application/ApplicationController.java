package com.careeros.application;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for job application CRUD.
 *
 * Endpoints:
 *   GET    /api/v1/applications        — List all applications for the user
 *   GET    /api/v1/applications/{id}   — Get a single application
 *   POST   /api/v1/applications        — Create an application
 *   PUT    /api/v1/applications/{id}   — Update an application
 *   DELETE /api/v1/applications/{id}   — Delete an application
 */
@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getUserApplications(
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplication(
            @PathVariable Long id,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        return ResponseEntity.ok(applicationService.getApplication(id, userId));
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestBody ApplicationRequest request,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        ApplicationResponse created = applicationService.createApplication(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        ApplicationResponse updated = applicationService.updateApplication(id, userId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        applicationService.deleteApplication(id, userId);
        return ResponseEntity.noContent().build();
    }
}
