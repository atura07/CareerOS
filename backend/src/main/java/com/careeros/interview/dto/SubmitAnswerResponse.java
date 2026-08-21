package com.careeros.interview.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAnswerResponse {
    private InterviewAnswerDto answer;
    private CandidateEvaluationDto evaluation;
    private InterviewStateDto interviewState;
    private InterviewQuestionDto nextQuestion;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateEvaluationDto {
        private Integer score;
        private Integer technicalAccuracy;
        private Integer clarity;
        private Integer communication;
        private Integer completeness;
        private List<String> strengths;
        private List<String> weaknesses;
        private String briefFeedback;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewStateDto {
        private String currentStage;
        private String difficulty;
        private Boolean shouldContinue;
    }
}
