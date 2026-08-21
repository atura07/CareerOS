package com.careeros.interview;

import java.util.List;

public interface InterviewAiService {

    List<QuestionPlan> generateInitialQuestions(String companyName, String roleTitle, String interviewType, String difficulty);

    QuestionPlan generateAdaptiveFollowUp(String currentQuestion, String transcript, String interviewType, String difficulty, int nextOrder);

    AnswerEvaluation evaluateAnswer(String questionText, String expectedCriteria, String transcript, String interviewType, String difficulty);

    ReportSynthesis synthesizeReport(InterviewSessionEntity session);

    record QuestionPlan(String questionText, String category, String expectedCriteria, boolean isAdaptive) {}

    record AnswerEvaluation(int score, String evaluation, String strengths, String improvementAreas) {}

    record ReportSynthesis(String strengthsJson, String weaknessesJson, String recommendationsJson, String nextActionsJson,
                           int overallScore, int technicalScore, int communicationScore, int answerQualityScore, String summary) {}
}
