package com.careeros.dashboard;

import com.careeros.dashboard.dto.DashboardSummaryDto;
import com.careeros.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        log.info("[DASHBOARD] GET /api/v1/dashboard/summary for userId={}", user.getId());
        return ResponseEntity.ok(dashboardService.getDashboardSummary(user.getId()));
    }
}
