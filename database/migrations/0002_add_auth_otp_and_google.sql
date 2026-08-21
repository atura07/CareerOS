-- =====================================================================
-- CareerOS — Migration 0002: Add Email OTP and Google OAuth Columns
-- =====================================================================

-- 1. Ensure `email_verified` column exists on `users` table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Allow nullable passwords for Google OAuth accounts
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- 3. Create `email_verification_otps` table for secure 6-digit OTP verification
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

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email ON email_verification_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expiry ON email_verification_otps(expiry_time);
