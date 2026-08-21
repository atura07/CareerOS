package com.careeros.dashboard;

import com.careeros.dashboard.dto.DashboardSummaryDto;
import com.careeros.user.User;
import com.careeros.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(
            @AuthenticationPrincipal Object principal,
            Authentication authentication) {

        Long userId = resolveUserId(principal, authentication);
        if (userId == null) {
            log.warn("[DASHBOARD] Unauthorized request to /api/v1/dashboard/summary");
            return ResponseEntity.status(401).build();
        }

        log.info("[DASHBOARD] GET /api/v1/dashboard/summary for userId={}", userId);
        return ResponseEntity.ok(dashboardService.getDashboardSummary(userId));
    }

    private Long resolveUserId(Object principal, Authentication authentication) {
        if (principal instanceof User user) {
            return user.getId();
        }
        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .map(User::getId)
                    .orElse(null);
        }
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName())
                    .map(User::getId)
                    .orElse(null);
        }
        return null;
    }
}
