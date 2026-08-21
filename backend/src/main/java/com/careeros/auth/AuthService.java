package com.careeros.auth;

import com.careeros.auth.email.EmailService;
import com.careeros.auth.google.GoogleAuthRequest;
import com.careeros.auth.google.GoogleAuthService;
import com.careeros.auth.google.GoogleUserInfo;
import com.careeros.auth.otp.OtpService;
import com.careeros.auth.otp.ResendOtpRequest;
import com.careeros.auth.otp.SendOtpRequest;
import com.careeros.auth.otp.VerifyOtpRequest;
import com.careeros.exception.EmailNotVerifiedException;
import com.careeros.jwt.JwtService;
import com.careeros.user.Role;
import com.careeros.user.User;
import com.careeros.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final EmailService emailService;
    private final GoogleAuthService googleAuthService;

    /**
     * Authenticate or register a user via Google OAuth2 / OIDC ID Token.
     */
    @Transactional
    public AuthenticationResponse loginWithGoogle(GoogleAuthRequest request) {
        GoogleUserInfo googleUser = googleAuthService.verifyToken(request.getIdToken());
        String email = googleUser.getEmail().trim().toLowerCase();

        User user;
        if (userService.existsByEmail(email)) {
            user = userService.findByEmail(email);
            // Ensure email is verified if authenticated via Google
            if (!user.isEmailVerified()) {
                user.setEmailVerified(true);
            }
            if ((user.getFullName() == null || user.getFullName().isBlank()) && googleUser.getFullName() != null) {
                user.setFullName(googleUser.getFullName());
            }
            userService.save(user);
        } else {
            // Auto-provision new user for Google OAuth (no password stored)
            user = User.builder()
                    .fullName(googleUser.getFullName() != null ? googleUser.getFullName() : email.split("@")[0])
                    .email(email)
                    .password(null)
                    .role(Role.ROLE_USER)
                    .emailVerified(true)
                    .build();
            userService.save(user);
        }


        String token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .verified(true)
                .message("Google authentication successful.")
                .build();
    }

    /**
     * Dispatches a 6-digit OTP code for passwordless login or email verification.
     */
    @Transactional
    public AuthenticationResponse sendOtp(SendOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (!otpService.canResend(email)) {
            throw new IllegalArgumentException("Please wait at least 60 seconds before requesting another code.");
        }

        String fullName = email.split("@")[0];
        if (userService.existsByEmail(email)) {
            User existingUser = userService.findByEmail(email);
            if (existingUser.getFullName() != null && !existingUser.getFullName().isBlank()) {
                fullName = existingUser.getFullName();
            }
        }

        String purpose = request.getPurpose() != null ? request.getPurpose() : "LOGIN";
        String rawOtp = otpService.generateAndSaveOtp(email, purpose);

        emailService.sendVerificationOtp(email, fullName, rawOtp);

        return AuthenticationResponse.builder()
                .email(email)
                .fullName(fullName)
                .verified(false)
                .message("A 6-digit verification code has been sent to your email.")
                .build();
    }

    /**
     * Verifies 6-digit OTP code, auto-provisions or activates user, and issues JWT token.
     */
    @Transactional
    public AuthenticationResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // 1. Validate OTP against stored hash, expiry, and attempt limits
        otpService.verifyOtp(email, request.getOtp());

        // 2. Find or create user
        User user;
        if (userService.existsByEmail(email)) {
            user = userService.findByEmail(email);
            user.setEmailVerified(true);
            userService.save(user);
        } else {
            // Auto-provision new user for passwordless login
            String defaultName = email.split("@")[0];
            if (!defaultName.isEmpty()) {
                defaultName = Character.toUpperCase(defaultName.charAt(0)) + (defaultName.length() > 1 ? defaultName.substring(1) : "");
            }
            user = User.builder()
                    .fullName(defaultName)
                    .email(email)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.ROLE_USER)
                    .emailVerified(true)
                    .build();
            userService.save(user);
        }

        // 3. Issue valid JWT token upon successful verification
        String token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .verified(true)
                .message("Verification successful.")
                .build();
    }

    /**
     * Resends a 6-digit verification code.
     */
    @Transactional
    public AuthenticationResponse resendOtp(ResendOtpRequest request) {
        return sendOtp(SendOtpRequest.builder()
                .email(request.getEmail())
                .purpose("LOGIN")
                .build());
    }

    /**
     * Backward-compatible email/password registration.
     */
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .emailVerified(false)
                .build();

        userService.save(user);

        // Generate secure 6-digit OTP and send verification email
        String rawOtp = otpService.generateAndSaveOtp(user.getEmail(), "VERIFY");
        emailService.sendVerificationOtp(user.getEmail(), user.getFullName(), rawOtp);

        return AuthenticationResponse.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .verified(false)
                .message("Registration successful. Please verify your email with the 6-digit code sent to you.")
                .build();
    }

    /**
     * Backward-compatible email/password login.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userService.existsByEmail(email)) {
            var existingUser = userService.findByEmail(email);
            if (existingUser.getPassword() == null || existingUser.getPassword().isBlank()) {
                throw new IllegalArgumentException("This account was created with Google Sign-In. Please click 'Continue with Google' to sign in.");
            }
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        var user = userService.findByEmail(email);

        // Block password login if email is not yet verified
        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException("Email is not verified. Please verify your email before logging in.", user.getEmail());
        }


        var token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .verified(true)
                .build();
    }
}



