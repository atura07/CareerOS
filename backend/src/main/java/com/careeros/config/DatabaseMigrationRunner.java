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
 *
 * Consolidated into fast, single-batch DDL executions to minimize network roundtrips
 * and prevent deployment startup timeouts on serverless PostgreSQL / Render.
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
        long startTime = System.currentTimeMillis();
        log.info("[STARTUP-PHASE] [MIGRATION] Executing pre-JPA database migrations on DataSource...");

        String consolidatedMigrationSql = """
            -- 1. Users table adjustments
            ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
            ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

            -- 2. Email verification OTPs
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
            CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email ON email_verification_otps(email);
            CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expiry ON email_verification_otps(expiry_time);

            -- 3. Resumes table
            CREATE TABLE IF NOT EXISTS resumes (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL,
                original_file_name VARCHAR(255) NOT NULL,
                stored_file_name VARCHAR(255) NOT NULL,
                file_size BIGINT NOT NULL,
                file_type VARCHAR(50) NOT NULL,
                extracted_text TEXT,
                upload_date TIMESTAMP NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
            ALTER TABLE resumes ADD COLUMN IF NOT EXISTS file_data BYTEA;

            -- 4. Applications table
            CREATE TABLE IF NOT EXISTS applications (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                company_logo VARCHAR(255),
                role VARCHAR(255) NOT NULL,
                package_value VARCHAR(100),
                location VARCHAR(255),
                applied_date VARCHAR(100),
                last_updated VARCHAR(100),
                status VARCHAR(50) NOT NULL DEFAULT 'Applied',
                next_round VARCHAR(100),
                notes TEXT,
                recruiter VARCHAR(255),
                recruiter_email VARCHAR(255),
                application_link VARCHAR(500),
                deadline VARCHAR(100),
                priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);

            -- 5. Roadmaps table
            CREATE TABLE IF NOT EXISTS roadmaps (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL,
                company VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                duration VARCHAR(100) NOT NULL,
                total_weeks INT NOT NULL DEFAULT 8,
                focus_areas TEXT,
                current_skills TEXT,
                weekly_plans TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON roadmaps(user_id);

            -- 6. Companies module tables
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

            -- 7. AI Mock Interview tables
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
                feedback_summary TEXT,
                problem_solving_score INT,
                project_score INT,
                current_stage VARCHAR(50) DEFAULT 'INTRODUCTION'
            );

            CREATE TABLE IF NOT EXISTS interview_questions (
                id BIGSERIAL PRIMARY KEY,
                session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
                question_order INT NOT NULL,
                question_text TEXT NOT NULL,
                category VARCHAR(50) NOT NULL,
                expected_criteria TEXT,
                is_adaptive_follow_up BOOLEAN DEFAULT FALSE
            );

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

            CREATE TABLE IF NOT EXISTS interview_reports (
                id BIGSERIAL PRIMARY KEY,
                session_id BIGINT NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
                overall_strengths TEXT,
                overall_weaknesses TEXT,
                recommendations TEXT,
                next_preparation_actions TEXT,
                questions_answered_well TEXT,
                questions_needing_improvement TEXT,
                detailed_feedback TEXT,
                recommended_dsa_topics TEXT,
                interview_readiness VARCHAR(50),
                personalized_message TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );

            -- 8. Ensure additive columns on pre-existing interview tables
            ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS problem_solving_score INT;
            ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS project_score INT;
            ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) DEFAULT 'INTRODUCTION';

            ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS questions_answered_well TEXT;
            ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS questions_needing_improvement TEXT;
            ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS detailed_feedback TEXT;
            ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS recommended_dsa_topics TEXT;
            ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS interview_readiness VARCHAR(50);
            ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS personalized_message TEXT;

            -- 9. ATS Analyses table
            CREATE TABLE IF NOT EXISTS ats_analyses (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL,
                resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
                analysis_mode VARCHAR(50) NOT NULL,
                job_title VARCHAR(255),
                company_name VARCHAR(255),
                job_description_hash VARCHAR(64),
                extraction_status VARCHAR(50),
                extraction_method VARCHAR(50),
                extraction_confidence DOUBLE PRECISION,
                overall_score INT,
                job_match_score INT,
                completeness_score INT,
                ats_compatibility_score INT,
                skills_score INT,
                experience_score INT,
                impact_score INT,
                language_score INT,
                required_skills_score INT,
                keyword_score INT,
                responsibility_score INT,
                eligibility_score INT,
                semantic_score INT,
                matched_skills_json TEXT,
                missing_skills_json TEXT,
                additional_skills_json TEXT,
                matched_keywords_json TEXT,
                missing_keywords_json TEXT,
                breakdown_json TEXT,
                strengths_json TEXT,
                improvements_json TEXT,
                warnings_json TEXT,
                summary TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_ats_analyses_user_id ON ats_analyses(user_id);
            CREATE INDEX IF NOT EXISTS idx_ats_analyses_resume_id ON ats_analyses(resume_id);
            CREATE INDEX IF NOT EXISTS idx_ats_analyses_lookup ON ats_analyses(resume_id, analysis_mode, job_description_hash);

            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS extraction_status VARCHAR(50);
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS extraction_method VARCHAR(50);
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS extraction_confidence DOUBLE PRECISION;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS target_role VARCHAR(100);
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS analysis_status VARCHAR(50);
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS confidence_score INT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS parsability_score INT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS contact_score INT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS readability_score INT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS achievements_score INT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS preferred_skills_score INT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS evidence_json TEXT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS quick_wins_json TEXT;
            ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS score_label VARCHAR(50);

            -- 10. User LeetCode accounts
            CREATE TABLE IF NOT EXISTS user_leetcode_accounts (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL UNIQUE,
                username VARCHAR(255) NOT NULL,
                connected BOOLEAN NOT NULL DEFAULT TRUE,
                last_synced_at TIMESTAMP,
                last_sync_status VARCHAR(50) DEFAULT 'SUCCESS',
                last_error_message TEXT,
                synced_data_json TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_user_leetcode_accounts_user_id ON user_leetcode_accounts(user_id);
        """;

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            stmt.execute(consolidatedMigrationSql);
            long elapsed = System.currentTimeMillis() - startTime;
            log.info("[STARTUP-PHASE] [MIGRATION] Pre-JPA database migration completed successfully in {} ms.", elapsed);

        } catch (Exception e) {
            log.warn("[STARTUP-PHASE] [MIGRATION] Batch migration notice: {}. Attempting statement-by-statement execution fallback...", e.getMessage());
            executeIndividualFallback(dataSource);
        }
    }

    private void executeIndividualFallback(DataSource dataSource) {
        String[] fallbackStatements = new String[] {
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE",
            "ALTER TABLE users ALTER COLUMN password DROP NOT NULL",
            "CREATE TABLE IF NOT EXISTS email_verification_otps (id BIGSERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, otp_hash VARCHAR(255) NOT NULL, expiry_time TIMESTAMP NOT NULL, attempt_count INT NOT NULL DEFAULT 0, created_at TIMESTAMP NOT NULL DEFAULT NOW(), resend_cooldown_until TIMESTAMP, purpose VARCHAR(50) NOT NULL DEFAULT 'LOGIN')",
            "CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email ON email_verification_otps(email)",
            "CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expiry ON email_verification_otps(expiry_time)",
            "CREATE TABLE IF NOT EXISTS resumes (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, original_file_name VARCHAR(255) NOT NULL, stored_file_name VARCHAR(255) NOT NULL, file_size BIGINT NOT NULL, file_type VARCHAR(50) NOT NULL, extracted_text TEXT, upload_date TIMESTAMP NOT NULL DEFAULT NOW())",
            "CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id)",
            "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS file_data BYTEA",
            "CREATE TABLE IF NOT EXISTS applications (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, company_name VARCHAR(255) NOT NULL, company_logo VARCHAR(255), role VARCHAR(255) NOT NULL, package_value VARCHAR(100), location VARCHAR(255), applied_date VARCHAR(100), last_updated VARCHAR(100), status VARCHAR(50) NOT NULL DEFAULT 'Applied', next_round VARCHAR(100), notes TEXT, recruiter VARCHAR(255), recruiter_email VARCHAR(255), application_link VARCHAR(500), deadline VARCHAR(100), priority VARCHAR(50) NOT NULL DEFAULT 'Medium', created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())",
            "CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id)",
            "CREATE TABLE IF NOT EXISTS roadmaps (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, company VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, duration VARCHAR(100) NOT NULL, total_weeks INT NOT NULL DEFAULT 8, focus_areas TEXT, current_skills TEXT, weekly_plans TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())",
            "CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON roadmaps(user_id)",
            "CREATE TABLE IF NOT EXISTS companies (id BIGSERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL UNIQUE, logo_url VARCHAR(500), website VARCHAR(500), description TEXT, industry VARCHAR(100), package_info VARCHAR(100), location VARCHAR(255), difficulty VARCHAR(50) DEFAULT 'Medium', active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())",
            "CREATE TABLE IF NOT EXISTS company_roles (id BIGSERIAL PRIMARY KEY, company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, location VARCHAR(255), experience_level VARCHAR(100), eligibility_info TEXT, required_skills TEXT, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP NOT NULL DEFAULT NOW())",
            "CREATE TABLE IF NOT EXISTS company_interview_processes (id BIGSERIAL PRIMARY KEY, company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE, role_id BIGINT REFERENCES company_roles(id) ON DELETE SET NULL, round_number INT NOT NULL, round_name VARCHAR(255) NOT NULL, round_type VARCHAR(50) NOT NULL, description TEXT, preparation_requirements TEXT)",
            "CREATE TABLE IF NOT EXISTS company_prep_topics (id BIGSERIAL PRIMARY KEY, company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE, role_id BIGINT REFERENCES company_roles(id) ON DELETE SET NULL, subject VARCHAR(100) NOT NULL, topic VARCHAR(255) NOT NULL, priority VARCHAR(50) DEFAULT 'Medium', estimated_effort VARCHAR(100), resources_json TEXT)",
            "CREATE TABLE IF NOT EXISTS user_company_preparations (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE, role_id BIGINT REFERENCES company_roles(id) ON DELETE SET NULL, status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED', started_date TIMESTAMP, target_date DATE, progress_percentage INT DEFAULT 0, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT uq_user_company_prep UNIQUE(user_id, company_id))",
            "CREATE TABLE IF NOT EXISTS user_prep_tasks (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, preparation_id BIGINT NOT NULL REFERENCES user_company_preparations(id) ON DELETE CASCADE, topic_id BIGINT NOT NULL REFERENCES company_prep_topics(id) ON DELETE CASCADE, status VARCHAR(50) NOT NULL DEFAULT 'PENDING', completed_date TIMESTAMP, notes TEXT, CONSTRAINT uq_user_prep_task UNIQUE(preparation_id, topic_id))",
            "CREATE TABLE IF NOT EXISTS interview_sessions (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL, company_name VARCHAR(255), role_title VARCHAR(255), interview_type VARCHAR(50) NOT NULL, difficulty VARCHAR(50) NOT NULL, status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS', started_at TIMESTAMP NOT NULL DEFAULT NOW(), ended_at TIMESTAMP, duration_minutes INT DEFAULT 30, overall_score INT, technical_score INT, communication_score INT, answer_quality_score INT, feedback_summary TEXT)",
            "CREATE TABLE IF NOT EXISTS interview_questions (id BIGSERIAL PRIMARY KEY, session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE, question_order INT NOT NULL, question_text TEXT NOT NULL, category VARCHAR(50) NOT NULL, expected_criteria TEXT, is_adaptive_follow_up BOOLEAN DEFAULT FALSE)",
            "CREATE TABLE IF NOT EXISTS interview_answers (id BIGSERIAL PRIMARY KEY, session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE, question_id BIGINT NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE, transcript TEXT NOT NULL, answer_duration_seconds INT, timestamp TIMESTAMP NOT NULL DEFAULT NOW(), ai_evaluation TEXT, score INT, strengths TEXT, improvement_areas TEXT)",
            "CREATE TABLE IF NOT EXISTS interview_reports (id BIGSERIAL PRIMARY KEY, session_id BIGINT NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE, overall_strengths TEXT, overall_weaknesses TEXT, recommendations TEXT, next_preparation_actions TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW())",
            "ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS problem_solving_score INT",
            "ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS project_score INT",
            "ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) DEFAULT 'INTRODUCTION'",
            "ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS questions_answered_well TEXT",
            "ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS questions_needing_improvement TEXT",
            "ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS detailed_feedback TEXT",
            "ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS recommended_dsa_topics TEXT",
            "ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS interview_readiness VARCHAR(50)",
            "ALTER TABLE interview_reports ADD COLUMN IF NOT EXISTS personalized_message TEXT",
            "CREATE TABLE IF NOT EXISTS ats_analyses (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE, analysis_mode VARCHAR(50) NOT NULL, job_title VARCHAR(255), company_name VARCHAR(255), job_description_hash VARCHAR(64), overall_score INT, job_match_score INT, completeness_score INT, ats_compatibility_score INT, skills_score INT, experience_score INT, impact_score INT, language_score INT, required_skills_score INT, keyword_score INT, responsibility_score INT, eligibility_score INT, semantic_score INT, matched_skills_json TEXT, missing_skills_json TEXT, additional_skills_json TEXT, matched_keywords_json TEXT, missing_keywords_json TEXT, breakdown_json TEXT, strengths_json TEXT, improvements_json TEXT, warnings_json TEXT, summary TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())",
            "CREATE INDEX IF NOT EXISTS idx_ats_analyses_user_id ON ats_analyses(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_ats_analyses_resume_id ON ats_analyses(resume_id)",
            "CREATE INDEX IF NOT EXISTS idx_ats_analyses_lookup ON ats_analyses(resume_id, analysis_mode, job_description_hash)",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS extraction_status VARCHAR(50)",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS extraction_method VARCHAR(50)",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS extraction_confidence DOUBLE PRECISION",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS target_role VARCHAR(100)",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS analysis_status VARCHAR(50)",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS confidence_score INT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS parsability_score INT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS contact_score INT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS readability_score INT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS achievements_score INT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS preferred_skills_score INT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS evidence_json TEXT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS quick_wins_json TEXT",
            "ALTER TABLE ats_analyses ADD COLUMN IF NOT EXISTS score_label VARCHAR(50)",
            "CREATE TABLE IF NOT EXISTS user_leetcode_accounts (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL UNIQUE, username VARCHAR(255) NOT NULL, connected BOOLEAN NOT NULL DEFAULT TRUE, last_synced_at TIMESTAMP, last_sync_status VARCHAR(50) DEFAULT 'SUCCESS', last_error_message TEXT, synced_data_json TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())",
            "CREATE INDEX IF NOT EXISTS idx_user_leetcode_accounts_user_id ON user_leetcode_accounts(user_id)"
        };

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            for (String sql : fallbackStatements) {
                try {
                    stmt.execute(sql);
                } catch (Exception e) {
                    log.debug("[STARTUP-PHASE] [MIGRATION] Notice executing statement [{}]: {}", sql, e.getMessage());
                }
            }
            log.info("[STARTUP-PHASE] [MIGRATION] Fallback migration execution completed.");
        } catch (Exception e) {
            log.error("[STARTUP-PHASE] [MIGRATION] Connection failure during fallback migration: {}", e.getMessage(), e);
        }
    }
}
