package com.careeros.auth.otp;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * JPA entity storing hashed Email OTP verification codes.
 * Raw OTPs are never persisted in the database.
 */
@Entity
@Table(name = "email_verification_otps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otpHash;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Builder.Default
    @Column(nullable = false)
    private int attemptCount = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime resendCooldownUntil;

    @Builder.Default
    @Column(nullable = false)
    private String purpose = "LOGIN";


    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
