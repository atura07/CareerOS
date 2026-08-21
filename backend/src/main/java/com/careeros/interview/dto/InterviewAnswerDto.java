package com.careeros.interview.dto;

import com.careeros.interview.InterviewAnswerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewAnswerDto {
    private Long id;
    private Long questionId;
    private String transcript;
    private Integer answerDurationSeconds;
    private LocalDateTime timestamp;
    private String aiEvaluation;
    private Integer score;
    private String strengths;
    private String improvementAreas;

    public static InterviewAnswerDto fromEntity(InterviewAnswerEntity a) {
        return InterviewAnswerDto.builder()
                .id(a.getId())
                .questionId(a.getQuestion() != null ? a.getQuestion().getId() : null)
                .transcript(a.getTranscript())
                .answerDurationSeconds(a.getAnswerDurationSeconds())
                .timestamp(a.getTimestamp())
                .aiEvaluation(a.getAiEvaluation())
                .score(a.getScore())
                .strengths(a.getStrengths())
                .improvementAreas(a.getImprovementAreas())
                .build();
    }
}
