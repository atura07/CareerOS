package com.careeros.interview.dto;

import com.careeros.interview.InterviewReportEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewReportDto {
    private Long id;
    private Long sessionId;
    private String overallStrengths;
    private String overallWeaknesses;
    private String recommendations;
    private String nextPreparationActions;
    private LocalDateTime createdAt;

    public static InterviewReportDto fromEntity(InterviewReportEntity r) {
        if (r == null) return null;
        return InterviewReportDto.builder()
                .id(r.getId())
                .sessionId(r.getSession() != null ? r.getSession().getId() : null)
                .overallStrengths(r.getOverallStrengths())
                .overallWeaknesses(r.getOverallWeaknesses())
                .recommendations(r.getRecommendations())
                .nextPreparationActions(r.getNextPreparationActions())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
