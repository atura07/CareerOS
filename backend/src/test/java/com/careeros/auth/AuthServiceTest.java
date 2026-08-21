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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private OtpService otpService;

    @Mock
    private EmailService emailService;

    @Mock
    private GoogleAuthService googleAuthService;

    @InjectMocks
    private AuthService authService;

    private final String email = "user@example.com";
    private final String password = "password123";
    private final String fullName = "John Doe";

    @Test
    void testLoginWithGoogle_NewUser_AutoProvisionsAndReturnsJwt() {
        GoogleUserInfo googleUser = GoogleUserInfo.builder()
                .email("googleuser@example.com")
                .fullName("Google User")
                .emailVerified(true)
                .build();

        when(googleAuthService.verifyToken("validGoogleIdToken")).thenReturn(googleUser);
        when(userService.existsByEmail("googleuser@example.com")).thenReturn(false);
        when(jwtService.generateToken(any())).thenReturn("googleJwtToken");

        GoogleAuthRequest request = GoogleAuthRequest.builder().idToken("validGoogleIdToken").build();
        AuthenticationResponse response = authService.loginWithGoogle(request);

        assertNotNull(response);
        assertEquals("googleJwtToken", response.getToken());
        assertEquals("googleuser@example.com", response.getEmail());
        assertTrue(response.isVerified());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userService).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertTrue(savedUser.isEmailVerified());
        assertNull(savedUser.getPassword());
        assertEquals("Google User", savedUser.getFullName());
    }


    @Test
    void testSendOtp_GeneratesCodeAndSendsEmail() {
        when(otpService.canResend(email)).thenReturn(true);
        when(otpService.generateAndSaveOtp(email, "LOGIN")).thenReturn("654321");

        SendOtpRequest request = SendOtpRequest.builder().email(email).purpose("LOGIN").build();
        AuthenticationResponse response = authService.sendOtp(request);

        assertNotNull(response);
        assertEquals(email, response.getEmail());
        assertFalse(response.isVerified());
        verify(emailService).sendVerificationOtp(eq(email), any(), eq("654321"));
    }

    @Test
    void testRegister_CreatesUnverifiedUserAndDispatchesOtp_NoTokenReturned() {
        when(userService.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
        when(otpService.generateAndSaveOtp(email, "VERIFY")).thenReturn("123456");


        RegisterRequest request = RegisterRequest.builder()
                .fullName(fullName)
                .email(email)
                .password(password)
                .build();

        AuthenticationResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals(email, response.getEmail());
        assertEquals(fullName, response.getFullName());
        assertFalse(response.isVerified());
        assertNull(response.getToken()); // Must NOT return JWT token before verification
        assertTrue(response.getMessage().contains("Registration successful"));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userService).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertFalse(savedUser.isEmailVerified());
        assertEquals(Role.ROLE_USER, savedUser.getRole());

        verify(emailService).sendVerificationOtp(email, fullName, "123456");
    }

    @Test
    void testVerifyOtp_MarksUserVerifiedAndReturnsJwtToken() {
        User user = User.builder()
                .id(1L)
                .email(email)
                .fullName(fullName)
                .emailVerified(false)
                .role(Role.ROLE_USER)
                .build();

        when(userService.existsByEmail(email)).thenReturn(true);
        when(userService.findByEmail(email)).thenReturn(user);
        when(otpService.verifyOtp(email, "123456")).thenReturn(true);
        when(jwtService.generateToken(any(User.class))).thenReturn("mockJwtToken");

        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .email(email)
                .otp("123456")
                .build();

        AuthenticationResponse response = authService.verifyOtp(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertTrue(response.isVerified());
        assertTrue(user.isEmailVerified());
        verify(userService).save(user);
    }

    @Test
    void testResendOtp_CooldownEnforced() {
        when(otpService.canResend(email)).thenReturn(false);

        ResendOtpRequest request = ResendOtpRequest.builder().email(email).build();

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                authService.resendOtp(request)
        );

        assertTrue(ex.getMessage().contains("Please wait"));
        verify(otpService, never()).generateAndSaveOtp(any(), any());
    }


    @Test
    void testAuthenticate_UnverifiedUser_ThrowsEmailNotVerifiedException() {
        User user = User.builder()
                .id(1L)
                .email(email)
                .fullName(fullName)
                .emailVerified(false)
                .build();

        when(userService.findByEmail(email)).thenReturn(user);

        AuthenticationRequest request = AuthenticationRequest.builder()
                .email(email)
                .password(password)
                .build();

        EmailNotVerifiedException ex = assertThrows(EmailNotVerifiedException.class, () ->
                authService.authenticate(request)
        );

        assertEquals(email, ex.getEmail());
        assertEquals("EMAIL_NOT_VERIFIED", ex.getErrorCode());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void testAuthenticate_VerifiedUser_ReturnsJwtToken() {
        User user = User.builder()
                .id(1L)
                .email(email)
                .fullName(fullName)
                .emailVerified(true)
                .build();

        when(userService.findByEmail(email)).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("mockJwtToken");

        AuthenticationRequest request = AuthenticationRequest.builder()
                .email(email)
                .password(password)
                .build();

        AuthenticationResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertTrue(response.isVerified());
    }
}
