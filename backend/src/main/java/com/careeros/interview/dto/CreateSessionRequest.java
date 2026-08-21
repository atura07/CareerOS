package com.careeros.interview.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionRequest {
    private Long companyId;
    private String companyName;
    private String roleTitle;
    private String interviewType; // HR, TECHNICAL, SYSTEM_DESIGN, DSA, BEHAVIORAL, MIXED
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer durationMinutes;
}
