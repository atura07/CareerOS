package com.careeros.dashboard;

import com.careeros.dashboard.dto.DashboardSummaryDto;

public interface DashboardService {

    /**
     * Aggregates and calculates 100% real, authenticated user dashboard metrics.
     *
     * @param userId Authenticated user's unique identifier.
     * @return Aggregated DashboardSummaryDto.
     */
    DashboardSummaryDto getDashboardSummary(Long userId);
}
