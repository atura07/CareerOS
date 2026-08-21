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
    private String questionsAnsweredWell;
    private String questionsNeedingImprovement;
    private String detailedFeedback;
    private String recommendations;
    private String nextPreparationActions;
    private String recommendedDsaTopics;
    private String interviewReadiness;
    private String personalizedMessage;
    private LocalDateTime createdAt;

    public static InterviewReportDto fromEntity(InterviewReportEntity r) {
        if (r == null) return null;
        return InterviewReportDto.builder()
                .id(r.getId())
                .sessionId(r.getSession() != null ? r.getSession().getId() : null)
                .overallStrengths(r.getOverallStrengths())
                .overallWeaknesses(r.getOverallWeaknesses())
                .questionsAnsweredWell(r.getQuestionsAnsweredWell())
                .questionsNeedingImprovement(r.getQuestionsNeedingImprovement())
                .detailedFeedback(r.getDetailedFeedback())
                .recommendations(r.getRecommendations())
                .nextPreparationActions(r.getNextPreparationActions())
                .recommendedDsaTopics(r.getRecommendedDsaTopics())
                .interviewReadiness(r.getInterviewReadiness())
                .personalizedMessage(r.getPersonalizedMessage())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
