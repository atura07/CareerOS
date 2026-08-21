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
            executeMigration(stmt, "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;", "users.email_verified column");

            // 2. Allow nullable password for Google OAuth users
            executeMigration(stmt, "ALTER TABLE users ALTER COLUMN password DROP NOT NULL;", "users.password nullable");

            // 3. Create email_verification_otps table
            executeMigration(stmt, """
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
            """, "email_verification_otps table");

            // 4. Create performance indexes
            executeMigration(stmt, "CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email ON email_verification_otps(email);", "email_verification_otps.email index");
            executeMigration(stmt, "CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expiry ON email_verification_otps(expiry_time);", "email_verification_otps.expiry index");

            // 5. Companies Module Tables
            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS companies (
                    id BIGSERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    logo_url VARCHAR(500),
                    website VARCHAR(500),
                    description TEXT,
                    industry VARCHAR(100),
                    package_info VARCHAR(100),
                    location VARCHAR(255),
                    difficulty VARCHAR(50) DEFAULT 'Medium',
                    active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            """, "companies table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS company_roles (
                    id BIGSERIAL PRIMARY KEY,
                    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    location VARCHAR(255),
                    experience_level VARCHAR(100),
                    eligibility_info TEXT,
                    required_skills TEXT,
                    active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            """, "company_roles table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS company_interview_processes (
                    id BIGSERIAL PRIMARY KEY,
                    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                    role_id BIGINT REFERENCES company_roles(id) ON DELETE SET NULL,
                    round_number INT NOT NULL,
                    round_name VARCHAR(255) NOT NULL,
                    round_type VARCHAR(50) NOT NULL,
                    description TEXT,
                    preparation_requirements TEXT
                );
            """, "company_interview_processes table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS company_prep_topics (
                    id BIGSERIAL PRIMARY KEY,
                    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                    role_id BIGINT REFERENCES company_roles(id) ON DELETE SET NULL,
                    subject VARCHAR(100) NOT NULL,
                    topic VARCHAR(255) NOT NULL,
                    priority VARCHAR(50) DEFAULT 'Medium',
                    estimated_effort VARCHAR(100),
                    resources_json TEXT
                );
            """, "company_prep_topics table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS user_company_preparations (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT NOT NULL,
                    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                    role_id BIGINT REFERENCES company_roles(id) ON DELETE SET NULL,
                    status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED',
                    started_date TIMESTAMP,
                    target_date DATE,
                    progress_percentage INT DEFAULT 0,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    CONSTRAINT uq_user_company_prep UNIQUE(user_id, company_id)
                );
            """, "user_company_preparations table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS user_prep_tasks (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT NOT NULL,
                    preparation_id BIGINT NOT NULL REFERENCES user_company_preparations(id) ON DELETE CASCADE,
                    topic_id BIGINT NOT NULL REFERENCES company_prep_topics(id) ON DELETE CASCADE,
                    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
                    completed_date TIMESTAMP,
                    notes TEXT,
                    CONSTRAINT uq_user_prep_task UNIQUE(preparation_id, topic_id)
                );
            """, "user_prep_tasks table");

            // 6. AI Mock Interview Tables
            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS interview_sessions (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT NOT NULL,
                    company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
                    company_name VARCHAR(255),
                    role_title VARCHAR(255),
                    interview_type VARCHAR(50) NOT NULL,
                    difficulty VARCHAR(50) NOT NULL,
                    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
                    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    ended_at TIMESTAMP,
                    duration_minutes INT DEFAULT 30,
                    overall_score INT,
                    technical_score INT,
                    communication_score INT,
                    answer_quality_score INT,
                    feedback_summary TEXT
                );
            """, "interview_sessions table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS interview_questions (
                    id BIGSERIAL PRIMARY KEY,
                    session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
                    question_order INT NOT NULL,
                    question_text TEXT NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    expected_criteria TEXT,
                    is_adaptive_follow_up BOOLEAN DEFAULT FALSE
                );
            """, "interview_questions table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS interview_answers (
                    id BIGSERIAL PRIMARY KEY,
                    session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
                    question_id BIGINT NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
                    transcript TEXT NOT NULL,
                    answer_duration_seconds INT,
                    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
                    ai_evaluation TEXT,
                    score INT,
                    strengths TEXT,
                    improvement_areas TEXT
                );
            """, "interview_answers table");

            executeMigration(stmt, """
                CREATE TABLE IF NOT EXISTS interview_reports (
                    id BIGSERIAL PRIMARY KEY,
                    session_id BIGINT NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
                    overall_strengths TEXT,
                    overall_weaknesses TEXT,
                    recommendations TEXT,
                    next_preparation_actions TEXT,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            """, "interview_reports table");

            log.info("Pre-JPA Migration: All CareerOS Phase 2 tables verified successfully.");

        } catch (Exception e) {
            log.error("Pre-JPA Database Migration Connection Exception: {}", e.getMessage(), e);
        }
    }

    private void executeMigration(Statement stmt, String sql, String description) {
        try {
            stmt.execute(sql);
            log.info("Migration successful: {}", description);
        } catch (Exception e) {
            log.warn("Migration notice for [{}]: {}", description, e.getMessage());
        }
    }
}
