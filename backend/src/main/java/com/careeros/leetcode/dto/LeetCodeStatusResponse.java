package com.careeros.leetcode.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeetCodeStatusResponse {
    private boolean connected;
    private String username;
    private LocalDateTime lastSyncedAt;
    private String lastSyncStatus;
    private String lastErrorMessage;
    private LeetCodeDataDto data;
}
