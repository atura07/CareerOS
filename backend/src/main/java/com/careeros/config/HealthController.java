package com.careeros.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Health check controller for container orchestrators (Render, Kubernetes, Docker)
 * and load balancers to probe service liveness and readiness without authentication.
 */
@RestController
public class HealthController {

    @GetMapping({"/", "/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "careeros-backend",
                "timestamp", Instant.now().toString()
        ));
    }
}
