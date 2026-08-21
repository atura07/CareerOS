package com.careeros.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Runs idempotent database migrations directly on the DataSource before Hibernate's
 * EntityManagerFactory or any JPA repositories are initialized.
 */
@Slf4j
@Component
public class DatabaseMigrationRunner implements BeanPostProcessor {

    private boolean migrated = false;

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSource dataSource && !migrated) {
            migrated = true;
            runMigration(dataSource);
        }
        return bean;
    }

    private void runMigration(DataSource dataSource) {
        log.info("Executing pre-JPA database migrations on DataSource...");
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            // 1. Add email_verified to users table if missing
            stmt.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;");
            log.info("Pre-JPA Migration: 'email_verified' column ensured on 'users' table.");

            // 2. Allow nullable password for Google OAuth users
            stmt.execute("ALTER TABLE users ALTER COLUMN password DROP NOT NULL;");
            log.info("Pre-JPA Migration: 'password' column nullability ensured on 'users' table.");

            // 3. Create email_verification_otps table
            stmt.execute("""
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
            log.info("Pre-JPA Migration: 'email_verification_otps' table ensured.");

            // 4. Create performance indexes
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email ON email_verification_otps(email);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expiry ON email_verification_otps(expiry_time);");
            log.info("Pre-JPA Migration: All indexes verified successfully.");

        } catch (Exception e) {
            log.error("Pre-JPA Database Migration Exception: {}", e.getMessage(), e);
        }
    }
}

