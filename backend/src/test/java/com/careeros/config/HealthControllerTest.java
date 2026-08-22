package com.careeros.config;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    private final HealthController healthController = new HealthController();

    @Test
    void testHealthEndpoint_Returns200AndStatusUp() {
        ResponseEntity<Map<String, Object>> response = healthController.health();

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("careeros-backend", response.getBody().get("service"));
        assertNotNull(response.getBody().get("timestamp"));
    }
}
