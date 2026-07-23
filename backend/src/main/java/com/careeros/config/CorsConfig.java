package com.careeros.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Global CORS configuration.
 *
 * Applies to all endpoints via CorsConfigurationSource bean,
 * which is consumed by SecurityConfig's SecurityFilterChain.
 * No @CrossOrigin annotations needed on controllers.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allowed origin(s) — frontend dev server
        configuration.setAllowedOrigins(List.of("http://localhost:5174"));

        // Allowed HTTP methods
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        // Allowed headers
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies, Authorization headers, etc.)
        configuration.setAllowCredentials(true);

        // Expose the Authorization header so the frontend can read it if needed
        configuration.setExposedHeaders(List.of("Authorization"));

        // How long (seconds) the preflight response can be cached
        configuration.setMaxAge(3600L);

        // Apply to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

