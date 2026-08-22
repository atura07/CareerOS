package com.careeros;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

@SpringBootApplication
@Slf4j
public class CareerOSApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerOSApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        Environment env = event.getApplicationContext().getEnvironment();
        String port = env.getProperty("local.server.port", env.getProperty("server.port", "8080"));
        String host = env.getProperty("server.address", "0.0.0.0");
        log.info("[STARTUP-PHASE] ========================================================");
        log.info("[STARTUP-PHASE] CareerOS Backend is LIVE and ACCEPTING TRAFFIC on {}:{}", host, port);
        log.info("[STARTUP-PHASE] Health probes active at /health, /api/health, and /");
        log.info("[STARTUP-PHASE] ========================================================");
    }
}
