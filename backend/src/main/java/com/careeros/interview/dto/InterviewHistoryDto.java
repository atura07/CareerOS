package com.careeros.interview.dto;

import com.careeros.interview.InterviewSessionEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewHistoryDto {
    private Long id;
    private String companyName;
    private String companyLogo;
    private String roleTitle;
    private String interviewType;
    private String difficulty;
    private LocalDateTime startedAt;
    private Integer durationMinutes;
    private Integer overallScore;
    private String status;
    private String result; // Excellent (>=80), Passed (>=60), Needs Work (<60)

    public static InterviewHistoryDto fromEntity(InterviewSessionEntity s) {
        Integer score = s.getOverallScore();
        String result = "In Progress";
        if ("COMPLETED".equalsIgnoreCase(s.getStatus()) && score != null) {
            result = score >= 80 ? "Excellent" : (score >= 60 ? "Passed" : "Needs Work");
        }

        return InterviewHistoryDto.builder()
                .id(s.getId())
                .companyName(s.getCompany() != null ? s.getCompany().getName() : (s.getCompanyName() != null ? s.getCompanyName() : "General"))
                .companyLogo(s.getCompany() != null ? s.getCompany().getLogoUrl() : "?")
                .roleTitle(s.getRoleTitle())
                .interviewType(s.getInterviewType())
                .difficulty(s.getDifficulty())
                .startedAt(s.getStartedAt())
                .durationMinutes(s.getDurationMinutes())
                .overallScore(score)
                .status(s.getStatus())
                .result(result)
                .build();
    }
}
