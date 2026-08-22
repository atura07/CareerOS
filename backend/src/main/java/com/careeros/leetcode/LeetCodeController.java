package com.careeros.leetcode;

import com.careeros.jwt.JwtService;
import com.careeros.leetcode.dto.ConnectLeetCodeRequest;
import com.careeros.leetcode.dto.LeetCodeDataDto;
import com.careeros.leetcode.dto.LeetCodePreviewResponse;
import com.careeros.leetcode.dto.LeetCodeStatusResponse;
import com.careeros.user.User;
import com.careeros.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/leetcode")
@RequiredArgsConstructor
public class LeetCodeController {

    private final LeetCodeService leetCodeService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    /**
     * Get the authenticated user's connected LeetCode status and complete dashboard data.
     */
    @GetMapping({"/connection", "/me", "/status"})
    public ResponseEntity<LeetCodeStatusResponse> getAccountStatus(
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication,
            HttpServletRequest request) {

        Long userId = resolveUserId(paramUserId, principal, authentication, request);
        log.info("GET /api/v1/leetcode/me for userId={}", userId);
        LeetCodeStatusResponse status = leetCodeService.getAccountStatus(userId);
        return ResponseEntity.ok(status);
    }

    /**
     * Preview and validate a LeetCode username before connecting.
     */
    @PostMapping("/preview")
    public ResponseEntity<LeetCodePreviewResponse> previewLeetCodeUser(
            @RequestBody ConnectLeetCodeRequest request) {

        log.info("POST /api/v1/leetcode/preview for username={}", request != null ? request.getUsername() : null);
        String username = request != null ? request.getUsername() : "";
        LeetCodePreviewResponse preview = leetCodeService.previewLeetCodeUser(username);
        return ResponseEntity.ok(preview);
    }

    /**
     * Connect or update a LeetCode account for the authenticated user.
     */
    @PostMapping("/connect")
    public ResponseEntity<LeetCodeStatusResponse> connectAccount(
            @RequestBody ConnectLeetCodeRequest request,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        Long userId = resolveUserId(paramUserId, principal, authentication, httpRequest);
        String username = request != null ? request.getUsername() : "";
        log.info("POST /api/v1/leetcode/connect for userId={}, username={}", userId, username);

        LeetCodeStatusResponse status = leetCodeService.connectAccount(userId, username);
        return ResponseEntity.ok(status);
    }

    /**
     * Disconnect the authenticated user's LeetCode account.
     */
    @DeleteMapping("/disconnect")
    public ResponseEntity<Void> disconnectAccount(
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        Long userId = resolveUserId(paramUserId, principal, authentication, httpRequest);
        log.info("DELETE /api/v1/leetcode/disconnect for userId={}", userId);

        leetCodeService.disconnectAccount(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Manually trigger a fresh sync for the authenticated user's LeetCode data.
     */
    @PostMapping("/sync")
    public ResponseEntity<LeetCodeStatusResponse> syncAccountData(
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @AuthenticationPrincipal Object principal,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        Long userId = resolveUserId(paramUserId, principal, authentication, httpRequest);
        log.info("POST /api/v1/leetcode/sync for userId={}", userId);

        LeetCodeStatusResponse status = leetCodeService.syncAccountData(userId);
        return ResponseEntity.ok(status);
    }

    /**
     * Public endpoint for testing or querying any public LeetCode user profile directly.
     */
    @GetMapping("/public/{username}")
    public ResponseEntity<LeetCodeDataDto> getPublicProfile(@PathVariable String username) {
        log.info("GET /api/v1/leetcode/public/{}", username);
        LeetCodeDataDto data = leetCodeService.fetchRawLeetCodeData(username);
        return ResponseEntity.ok(data);
    }

    private Long resolveUserId(Long paramUserId, Object principal, Authentication authentication, HttpServletRequest request) {
        if (principal instanceof User user) {
            return user.getId();
        }
        String email = null;
        if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            email = authentication.getName();
        }

        if ((email == null || email.isBlank()) && request != null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    email = jwtService.extractUsername(authHeader.substring(7));
                } catch (Exception ignored) {}
            }
        }

        if (email != null && !email.isBlank()) {
            final String userEmail = email.trim();
            return userRepository.findByEmail(userEmail)
                    .map(User::getId)
                    .orElseGet(() -> {
                        try {
                            User newUser = User.builder()
                                    .email(userEmail)
                                    .fullName(userEmail.contains("@") ? userEmail.split("@")[0] : userEmail)
                                    .emailVerified(true)
                                    .role(com.careeros.user.Role.ROLE_USER)
                                    .build();
                            return userRepository.save(newUser).getId();
                        } catch (Exception e) {
                            return userRepository.findByEmail(userEmail)
                                    .map(User::getId)
                                    .orElse(paramUserId != null ? paramUserId : 1L);
                        }
                    });
        }

        if (paramUserId != null) {
            return paramUserId;
        }

        return 1L;
    }
}
