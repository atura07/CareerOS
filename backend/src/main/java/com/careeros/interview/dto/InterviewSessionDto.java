package com.careeros.interview.dto;

import com.careeros.interview.InterviewSessionEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSessionDto {
    private Long id;
    private Long userId;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private String roleTitle;
    private String interviewType;
    private String difficulty;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Integer durationMinutes;
    private Integer overallScore;
    private Integer technicalScore;
    private Integer communicationScore;
    private Integer answerQualityScore;
    private String feedbackSummary;
    private List<InterviewQuestionDto> questions;
    private InterviewReportDto report;

    public static InterviewSessionDto fromEntity(InterviewSessionEntity s) {
        List<InterviewQuestionDto> questionDtos = s.getQuestions() != null
                ? s.getQuestions().stream().map(InterviewQuestionDto::fromEntity).toList()
                : List.of();

        return InterviewSessionDto.builder()
                .id(s.getId())
                .userId(s.getUserId())
                .companyId(s.getCompany() != null ? s.getCompany().getId() : null)
                .companyName(s.getCompany() != null ? s.getCompany().getName() : s.getCompanyName())
                .companyLogo(s.getCompany() != null ? s.getCompany().getLogoUrl() : "?")
                .roleTitle(s.getRoleTitle())
                .interviewType(s.getInterviewType())
                .difficulty(s.getDifficulty())
                .status(s.getStatus())
                .startedAt(s.getStartedAt())
                .endedAt(s.getEndedAt())
                .durationMinutes(s.getDurationMinutes())
                .overallScore(s.getOverallScore())
                .technicalScore(s.getTechnicalScore())
                .communicationScore(s.getCommunicationScore())
                .answerQualityScore(s.getAnswerQualityScore())
                .feedbackSummary(s.getFeedbackSummary())
                .questions(questionDtos)
                .report(s.getReport() != null ? InterviewReportDto.fromEntity(s.getReport()) : null)
                .build();
    }
}
