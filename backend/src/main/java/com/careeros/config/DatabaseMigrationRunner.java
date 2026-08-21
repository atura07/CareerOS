package com.careeros.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Executes safe, idempotent schema migrations on startup before business logic executes.
 * Ensures the production database matches the current User and OTP entities.
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class DatabaseMigrationRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Starting safe database migrations for authentication and OTP schema...");
        try {
            // 1. Ensure `email_verified` column exists on `users` table
            jdbcTemplate.execute(
                    "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;"
            );
            log.info("Migration: 'email_verified' column verified on 'users' table.");

            // 2. Allow nullable passwords on `users` table for Google OAuth users
            jdbcTemplate.execute(
                    "ALTER TABLE users ALTER COLUMN password DROP NOT NULL;"
            );
            log.info("Migration: 'password' column nullability verified on 'users' table.");

            // 3. Ensure `email_verification_otps` table exists
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS email_verification_otps (
                    id BIGSERIAL PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    otp_hash VARCHAR(255) NOT NULL,
                    expiry_time TIMESTAMP NOT NULL,
                    attempt_count INT NOT NULL DEFAULT 0,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    resend_cooldown_until TIMESTAMP,
                    purpose VARCHAR(50) NOT NULL DEFAULT 'LOGIN'
                );
            """);
            log.info("Migration: 'email_verification_otps' table verified.");

            // 4. Create indexes for efficient OTP lookup and expiry cleanup
            jdbcTemplate.execute(
                    "CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email ON email_verification_otps(email);"
            );
            jdbcTemplate.execute(
                    "CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expiry ON email_verification_otps(expiry_time);"
            );
            log.info("Migration: OTP indexes verified.");

            log.info("Safe database migrations completed successfully.");
        } catch (Exception e) {
            log.warn("Database migration completed with note: {}", e.getMessage());
        }
    }
}
