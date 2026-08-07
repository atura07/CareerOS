package com.careeros.roadmap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for roadmap CRUD.
 *
 * Endpoints:
 *   GET    /api/v1/roadmaps        — List all roadmaps for the user
 *   GET    /api/v1/roadmaps/{id}   — Get a single roadmap
 *   POST   /api/v1/roadmaps        — Create a roadmap
 *   PUT    /api/v1/roadmaps/{id}   — Update a roadmap
 *   DELETE /api/v1/roadmaps/{id}   — Delete a roadmap
 */
@RestController
@RequestMapping("/api/v1/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping
    public ResponseEntity<List<RoadmapResponse>> getUserRoadmaps(
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        return ResponseEntity.ok(roadmapService.getUserRoadmaps(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoadmapResponse> getRoadmap(
            @PathVariable Long id,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        return ResponseEntity.ok(roadmapService.getRoadmap(id, userId));
    }

    @PostMapping
    public ResponseEntity<RoadmapResponse> createRoadmap(
            @RequestBody RoadmapRequest request,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        RoadmapResponse created = roadmapService.createRoadmap(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoadmapResponse> updateRoadmap(
            @PathVariable Long id,
            @RequestBody RoadmapRequest request,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        RoadmapResponse updated = roadmapService.updateRoadmap(id, userId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadmap(
            @PathVariable Long id,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        roadmapService.deleteRoadmap(id, userId);
        return ResponseEntity.noContent().build();
    }
}
