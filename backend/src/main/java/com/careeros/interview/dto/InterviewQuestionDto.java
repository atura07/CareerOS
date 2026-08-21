package com.careeros.interview.dto;

import com.careeros.interview.InterviewQuestionEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionDto {
    private Long id;
    private Integer questionOrder;
    private String questionText;
    private String category;
    private String expectedCriteria;
    private Boolean isAdaptiveFollowUp;
    private Boolean isAnswered;
    private Integer score;
    private String aiEvaluation;

    public static InterviewQuestionDto fromEntity(InterviewQuestionEntity q) {
        return InterviewQuestionDto.builder()
                .id(q.getId())
                .questionOrder(q.getQuestionOrder())
                .questionText(q.getQuestionText())
                .category(q.getCategory())
                .expectedCriteria(q.getExpectedCriteria())
                .isAdaptiveFollowUp(q.getIsAdaptiveFollowUp())
                .isAnswered(q.getAnswer() != null)
                .score(q.getAnswer() != null ? q.getAnswer().getScore() : null)
                .aiEvaluation(q.getAnswer() != null ? q.getAnswer().getAiEvaluation() : null)
                .build();
    }
}
