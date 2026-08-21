package com.careeros.auth;

import com.careeros.auth.google.GoogleAuthRequest;
import com.careeros.auth.otp.ResendOtpRequest;
import com.careeros.auth.otp.SendOtpRequest;
import com.careeros.auth.otp.VerifyOtpRequest;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        var response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthenticationResponse> googleLogin(
            @Valid @RequestBody GoogleAuthRequest request
    ) {
        var response = authService.loginWithGoogle(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/otp/send")
    public ResponseEntity<AuthenticationResponse> sendOtp(
            @Valid @RequestBody SendOtpRequest request
    ) {
        var response = authService.sendOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthenticationResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {
        var response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<AuthenticationResponse> resendOtp(
            @Valid @RequestBody ResendOtpRequest request
    ) {
        var response = authService.resendOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request
    ) {
        var response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

}


