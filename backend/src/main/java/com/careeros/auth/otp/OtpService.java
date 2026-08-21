package com.careeros.auth.otp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final EmailVerificationOtpRepository otpRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates a cryptographically secure 6-digit OTP, stores its SHA-256 hash,
     * and returns the raw OTP to be dispatched via email.
     */
    @Transactional
    public String generateAndSaveOtp(String email) {
        return generateAndSaveOtp(email, "LOGIN");
    }

    /**
     * Generates a cryptographically secure 6-digit OTP, stores its SHA-256 hash
     * with explicit purpose, and returns the raw OTP to be dispatched via email.
     */
    @Transactional
    public String generateAndSaveOtp(String email, String purpose) {
        String cleanEmail = email.trim().toLowerCase();

        // Remove any existing active OTPs for this email to avoid collisions
        otpRepository.deleteByEmail(cleanEmail);

        // Generate a 6-digit numeric OTP (100000 to 999999)
        int randomCode = 100000 + secureRandom.nextInt(900000);
        String rawOtp = String.valueOf(randomCode);

        String otpHash = hashOtp(rawOtp);
        LocalDateTime now = LocalDateTime.now();

        EmailVerificationOtp otpEntity = EmailVerificationOtp.builder()
                .email(cleanEmail)
                .otpHash(otpHash)
                .purpose(purpose != null ? purpose : "LOGIN")
                .expiryTime(now.plusMinutes(OTP_EXPIRY_MINUTES))
                .attemptCount(0)
                .createdAt(now)
                .resendCooldownUntil(now.plusSeconds(RESEND_COOLDOWN_SECONDS))
                .build();

        otpRepository.save(otpEntity);
        return rawOtp;
    }


    /**
     * Validates the provided raw OTP against the stored hash.
     * Enforces expiry and max-attempt security limits.
     * Deletes the OTP immediately upon successful verification.
     */
    @Transactional
    public boolean verifyOtp(String email, String rawOtp) {
        String cleanEmail = email.trim().toLowerCase();

        EmailVerificationOtp otpRecord = otpRepository.findTopByEmailOrderByCreatedAtDesc(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("No verification code found. Please request a new code."));

        // 1. Check expiration
        if (LocalDateTime.now().isAfter(otpRecord.getExpiryTime())) {
            otpRepository.delete(otpRecord);
            throw new IllegalArgumentException("Verification code has expired. Please request a new one.");
        }

        // 2. Check max attempt limit
        if (otpRecord.getAttemptCount() >= MAX_ATTEMPTS) {
            otpRepository.delete(otpRecord);
            throw new IllegalArgumentException("Too many failed attempts. Please request a new verification code.");
        }

        // 3. Verify hash
        String inputHash = hashOtp(rawOtp.trim());
        if (!inputHash.equals(otpRecord.getOtpHash())) {
            otpRecord.setAttemptCount(otpRecord.getAttemptCount() + 1);
            otpRepository.save(otpRecord);
            int remaining = MAX_ATTEMPTS - otpRecord.getAttemptCount();
            if (remaining <= 0) {
                otpRepository.delete(otpRecord);
                throw new IllegalArgumentException("Too many failed attempts. Please request a new verification code.");
            }
            throw new IllegalArgumentException("Invalid verification code. " + remaining + " attempt(s) remaining.");
        }

        // 4. Verification successful -> Invalidate / Delete OTP immediately
        otpRepository.deleteByEmail(cleanEmail);
        return true;
    }

    /**
     * Checks whether resend cooldown is active.
     */
    public boolean canResend(String email) {
        String cleanEmail = email.trim().toLowerCase();
        return otpRepository.findTopByEmailOrderByCreatedAtDesc(cleanEmail)
                .map(otp -> otp.getResendCooldownUntil() == null || LocalDateTime.now().isAfter(otp.getResendCooldownUntil()))
                .orElse(true);
    }

    /**
     * Compute SHA-256 hash of raw OTP string.
     */
    private String hashOtp(String rawOtp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawOtp.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
