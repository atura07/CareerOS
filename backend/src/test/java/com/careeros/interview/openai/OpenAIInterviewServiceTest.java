package com.careeros.interview.openai;

import com.careeros.openai.OpenAIClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OpenAIInterviewServiceTest {

    @Mock
    private OpenAIClient openAIClient;

    private ObjectMapper objectMapper = new ObjectMapper();

    private OpenAIInterviewServiceImpl openAIService;

    @BeforeEach
    void setUp() {
        openAIService = new OpenAIInterviewServiceImpl(openAIClient, objectMapper);
    }

    @Test
    void testGenerateStartQuestion() {
        String mockJsonResponse = """
            {
              "interviewerGreeting": "Hi Atul, welcome to your mock interview for Software Engineer at Google.",
              "question": "To begin, please tell me about yourself and your background.",
              "topic": "Background & Self Introduction",
              "stage": "INTRODUCTION",
              "reason": "Opening question"
            }
            """;

        when(openAIClient.executeChatCompletion(anyString(), anyList(), anyDouble()))
                .thenReturn(mockJsonResponse);

        OpenAIInterviewService.StartQuestionResult result = openAIService.generateStartQuestion(
                "Atul", "Google", "Software Engineer", "TECHNICAL", "Hard"
        );

        assertNotNull(result);
        assertEquals("To begin, please tell me about yourself and your background.", result.question());
        assertEquals("INTRODUCTION", result.stage());
        assertEquals("Background & Self Introduction", result.topic());
    }

    @Test
    void testEvaluateAndGenerateNextQuestion() {
        String mockJsonResponse = """
            {
              "candidateAnswerEvaluation": {
                "score": 90,
                "technicalAccuracy": 90,
                "clarity": 95,
                "communication": 90,
                "completeness": 85,
                "strengths": ["Clear explanation of Spring Boot DI", "Strong backend architecture knowledge"],
                "weaknesses": ["Could mention transaction rollback"],
                "briefFeedback": "Excellent overview of your Spring Boot project."
              },
              "interviewState": {
                "currentStage": "PROJECT",
                "difficulty": "Medium",
                "shouldContinue": true
              },
              "nextQuestion": {
                "question": "How did you design your PostgreSQL schema and manage foreign key relationships?",
                "topic": "Database Schema Design",
                "reason": "Diving deeper into candidate's project schema"
              }
            }
            """;

        when(openAIClient.executeChatCompletion(anyString(), anyList(), anyDouble()))
                .thenReturn(mockJsonResponse);

        OpenAIInterviewService.ConversationalResponse response = openAIService.evaluateAndGenerateNextQuestion(
                "Atul",
                "Google",
                "Software Engineer",
                "TECHNICAL",
                "Medium",
                "INTRODUCTION",
                List.of(),
                "Tell me about yourself.",
                "I am a backend developer working with Spring Boot and PostgreSQL."
        );

        assertNotNull(response);
        assertEquals(90, response.candidateAnswerEvaluation().score());
        assertEquals("PROJECT", response.interviewState().currentStage());
        assertEquals("How did you design your PostgreSQL schema and manage foreign key relationships?", response.nextQuestion().question());
    }

    @Test
    void testSynthesizeFinalReport() {
        String mockJsonResponse = """
            {
              "overallScore": 88,
              "technicalScore": 90,
              "communicationScore": 88,
              "problemSolvingScore": 85,
              "projectScore": 89,
              "strongestSkills": ["Java & Spring Boot", "System Architecture"],
              "weakestAreas": ["Distributed Caching"],
              "questionsAnsweredWell": ["Spring Boot DI", "Database Schema"],
              "questionsNeedingImprovement": ["Redis Cache Invalidation"],
              "detailedFeedback": "The candidate performed very well across all technical questions.",
              "top5TopicsToStudyNext": ["Cache Invalidation", "Distributed Locks"],
              "recommendedDsaTopics": ["Tree Traversals", "Dijkstra"],
              "interviewReadiness": "INTERVIEW READY",
              "personalizedMessage": "Impressive depth in backend fundamentals. Great job!"
            }
            """;

        when(openAIClient.executeChatCompletion(anyString(), anyList(), anyDouble()))
                .thenReturn(mockJsonResponse);

        OpenAIInterviewService.FinalReportResult report = openAIService.synthesizeFinalReport(
                "Atul",
                "Google",
                "Software Engineer",
                "TECHNICAL",
                "Hard",
                List.of(new OpenAIInterviewService.ConversationTurn("Tell me about yourself.", "I build Spring Boot apps.", "INTRODUCTION", 90))
        );

        assertNotNull(report);
        assertEquals(88, report.overallScore());
        assertEquals("INTERVIEW READY", report.interviewReadiness());
        assertEquals(2, report.strongestSkills().size());
    }
}
