package com.careeros.auth;

import com.careeros.auth.otp.EmailVerificationOtp;
import com.careeros.auth.otp.EmailVerificationOtpRepository;
import com.careeros.auth.otp.OtpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private EmailVerificationOtpRepository otpRepository;

    @InjectMocks
    private OtpService otpService;

    private final String testEmail = "test@example.com";

    @Test
    void testGenerateAndSaveOtp_Generates6DigitsAndHashes() {
        String rawOtp = otpService.generateAndSaveOtp(testEmail);

        assertNotNull(rawOtp);
        assertEquals(6, rawOtp.length());
        assertTrue(rawOtp.matches("^[0-9]{6}$"));

        ArgumentCaptor<EmailVerificationOtp> captor = ArgumentCaptor.forClass(EmailVerificationOtp.class);
        verify(otpRepository).save(captor.capture());

        EmailVerificationOtp saved = captor.getValue();
        assertEquals(testEmail, saved.getEmail());
        assertNotEquals(rawOtp, saved.getOtpHash()); // Hash must not equal raw OTP
        assertTrue(saved.getExpiryTime().isAfter(LocalDateTime.now().plusMinutes(9)));
        assertEquals(0, saved.getAttemptCount());
    }

    @Test
    void testVerifyOtp_CorrectOtp_SucceedsAndDeletesRecord() {
        // SHA-256 for "123456" is "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
        EmailVerificationOtp savedEntity = EmailVerificationOtp.builder()
                .email(testEmail)
                .otpHash("8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92")
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .attemptCount(0)
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(testEmail)).thenReturn(Optional.of(savedEntity));

        boolean result = otpService.verifyOtp(testEmail, "123456");

        assertTrue(result);
        verify(otpRepository).deleteByEmail(testEmail);
    }

    @Test
    void testVerifyOtp_InvalidOtp_IncrementsAttempts() {
        EmailVerificationOtp savedEntity = EmailVerificationOtp.builder()
                .email(testEmail)
                .otpHash("8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92")
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .attemptCount(0)
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(testEmail)).thenReturn(Optional.of(savedEntity));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                otpService.verifyOtp(testEmail, "000000")
        );

        assertTrue(ex.getMessage().contains("Invalid verification code"));
        assertEquals(1, savedEntity.getAttemptCount());
        verify(otpRepository).save(savedEntity);
    }


    @Test
    void testVerifyOtp_ExpiredOtp_ThrowsAndDeletes() {
        EmailVerificationOtp expiredEntity = EmailVerificationOtp.builder()
                .email(testEmail)
                .otpHash("somehash")
                .expiryTime(LocalDateTime.now().minusMinutes(1))
                .attemptCount(0)
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(testEmail)).thenReturn(Optional.of(expiredEntity));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                otpService.verifyOtp(testEmail, "123456")
        );

        assertTrue(ex.getMessage().contains("expired"));
        verify(otpRepository).delete(expiredEntity);
    }

    @Test
    void testVerifyOtp_MoreThan5Attempts_LocksAndDeletes() {
        EmailVerificationOtp lockedEntity = EmailVerificationOtp.builder()
                .email(testEmail)
                .otpHash("somehash")
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .attemptCount(5)
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(testEmail)).thenReturn(Optional.of(lockedEntity));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                otpService.verifyOtp(testEmail, "123456")
        );

        assertTrue(ex.getMessage().contains("Too many failed attempts"));
        verify(otpRepository).delete(lockedEntity);
    }

    @Test
    void testResendCooldown() {
        EmailVerificationOtp cooldownEntity = EmailVerificationOtp.builder()
                .email(testEmail)
                .resendCooldownUntil(LocalDateTime.now().plusSeconds(45))
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(testEmail)).thenReturn(Optional.of(cooldownEntity));

        assertFalse(otpService.canResend(testEmail));
    }
}
