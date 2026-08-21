package com.careeros.interview.openai;

import java.util.List;

public interface OpenAIInterviewService {

    record ConversationTurn(String question, String answer, String stage, Integer score) {}

    record StartQuestionResult(
            String interviewerGreeting,
            String question,
            String topic,
            String stage,
            String reason
    ) {}

    record CandidateEvaluation(
            int score,
            int technicalAccuracy,
            int clarity,
            int communication,
            int completeness,
            List<String> strengths,
            List<String> weaknesses,
            String briefFeedback
    ) {}

    record InterviewState(
            String currentStage,
            String difficulty,
            boolean shouldContinue
    ) {}

    record NextQuestion(
            String question,
            String topic,
            String reason
    ) {}

    record ConversationalResponse(
            CandidateEvaluation candidateAnswerEvaluation,
            InterviewState interviewState,
            NextQuestion nextQuestion
    ) {}

    record FinalReportResult(
            int overallScore,
            int technicalScore,
            int communicationScore,
            int problemSolvingScore,
            int projectScore,
            List<String> strongestSkills,
            List<String> weakestAreas,
            List<String> questionsAnsweredWell,
            List<String> questionsNeedingImprovement,
            String detailedFeedback,
            List<String> top5TopicsToStudyNext,
            List<String> recommendedDsaTopics,
            String interviewReadiness,
            String personalizedMessage
    ) {}

    StartQuestionResult generateStartQuestion(
            String candidateName,
            String companyName,
            String roleTitle,
            String interviewType,
            String difficulty
    );

    ConversationalResponse evaluateAndGenerateNextQuestion(
            String candidateName,
            String companyName,
            String roleTitle,
            String interviewType,
            String difficulty,
            String currentStage,
            List<ConversationTurn> history,
            String currentQuestionText,
            String candidateAnswer
    );

    FinalReportResult synthesizeFinalReport(
            String candidateName,
            String companyName,
            String roleTitle,
            String interviewType,
            String difficulty,
            List<ConversationTurn> history
    );
}
