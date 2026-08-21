package com.careeros.interview;

import com.careeros.company.CompanyRepository;
import com.careeros.interview.dto.*;
import com.careeros.interview.openai.OpenAIInterviewService;
import com.careeros.user.User;
import com.careeros.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private InterviewQuestionRepository questionRepository;

    @Mock
    private InterviewAnswerRepository answerRepository;

    @Mock
    private InterviewReportRepository reportRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OpenAIInterviewService openAIService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private InterviewServiceImpl interviewService;

    private InterviewSessionEntity testSession;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(100L)
                .fullName("Atul")
                .email("atul@example.com")
                .build();

        testSession = InterviewSessionEntity.builder()
                .id(1L)
                .userId(100L)
                .companyName("Google")
                .roleTitle("Software Engineer")
                .interviewType("TECHNICAL")
                .difficulty("Medium")
                .status("IN_PROGRESS")
                .currentStage("INTRODUCTION")
                .startedAt(LocalDateTime.now())
                .durationMinutes(30)
                .questions(new ArrayList<>())
                .answers(new ArrayList<>())
                .build();
    }

    @Test
    void testCreateSession() {
        CreateSessionRequest req = CreateSessionRequest.builder()
                .companyName("Google")
                .roleTitle("Software Engineer")
                .interviewType("TECHNICAL")
                .difficulty("Medium")
                .durationMinutes(30)
                .build();

        when(userRepository.findById(100L)).thenReturn(Optional.of(testUser));
        when(sessionRepository.save(any(InterviewSessionEntity.class)))
                .thenAnswer(inv -> {
                    InterviewSessionEntity s = inv.getArgument(0);
                    s.setId(1L);
                    return s;
                });

        when(openAIService.generateStartQuestion(any(), any(), any(), any(), any()))
                .thenReturn(new OpenAIInterviewService.StartQuestionResult(
                        "Hi Atul, welcome to your mock interview.",
                        "Please tell me about yourself and your technical background.",
                        "Introduction",
                        "INTRODUCTION",
                        "Opening question"
                ));

        when(questionRepository.save(any(InterviewQuestionEntity.class)))
                .thenAnswer(inv -> {
                    InterviewQuestionEntity q = inv.getArgument(0);
                    q.setId(10L);
                    return q;
                });

        InterviewSessionDto result = interviewService.createSession(100L, req);

        assertNotNull(result);
        assertEquals("Google", result.getCompanyName());
        assertEquals("IN_PROGRESS", result.getStatus());
        assertEquals("INTRODUCTION", result.getCurrentStage());
        assertEquals(1, result.getQuestions().size());
        assertEquals("Please tell me about yourself and your technical background.", result.getQuestions().get(0).getQuestionText());
    }

    @Test
    void testSubmitAnswer() {
        InterviewQuestionEntity question = InterviewQuestionEntity.builder()
                .id(5L)
                .session(testSession)
                .questionOrder(1)
                .questionText("Please tell me about yourself and what you've worked on.")
                .category("Introduction")
                .expectedCriteria("Self intro")
                .build();

        testSession.getQuestions().add(question);

        SubmitAnswerRequest req = SubmitAnswerRequest.builder()
                .transcript("I am a CS student who built a Spring Boot e-commerce application with PostgreSQL.")
                .answerDurationSeconds(40)
                .build();

        when(userRepository.findById(100L)).thenReturn(Optional.of(testUser));
        when(sessionRepository.findByIdAndUserId(1L, 100L)).thenReturn(Optional.of(testSession));
        when(questionRepository.findById(5L)).thenReturn(Optional.of(question));

        OpenAIInterviewService.CandidateEvaluation eval = new OpenAIInterviewService.CandidateEvaluation(
                88, 85, 90, 88, 85,
                List.of("Clear project mention", "Good mention of Spring Boot"),
                List.of("Could elaborate on database indexing"),
                "Great start — good overview of your full-stack experience."
        );
        OpenAIInterviewService.InterviewState state = new OpenAIInterviewService.InterviewState(
                "PROJECT", "Medium", true
        );
        OpenAIInterviewService.NextQuestion nextQ = new OpenAIInterviewService.NextQuestion(
                "You mentioned your Spring Boot e-commerce project. Can you explain how you designed the database schema?",
                "Database Schema Design",
                "Deep dive into candidate's project"
        );

        when(openAIService.evaluateAndGenerateNextQuestion(any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(new OpenAIInterviewService.ConversationalResponse(eval, state, nextQ));

        when(answerRepository.findByQuestionId(5L)).thenReturn(Optional.empty());
        when(answerRepository.save(any(InterviewAnswerEntity.class)))
                .thenAnswer(inv -> {
                    InterviewAnswerEntity a = inv.getArgument(0);
                    a.setId(20L);
                    return a;
                });

        when(questionRepository.save(any(InterviewQuestionEntity.class)))
                .thenAnswer(inv -> {
                    InterviewQuestionEntity q = inv.getArgument(0);
                    q.setId(30L);
                    return q;
                });

        SubmitAnswerResponse result = interviewService.submitAnswer(100L, 1L, 5L, req);

        assertNotNull(result);
        assertNotNull(result.getAnswer());
        assertEquals(88, result.getEvaluation().getScore());
        assertEquals("Great start — good overview of your full-stack experience.", result.getEvaluation().getBriefFeedback());
        assertEquals("PROJECT", result.getInterviewState().getCurrentStage());
        assertNotNull(result.getNextQuestion());
        assertEquals("You mentioned your Spring Boot e-commerce project. Can you explain how you designed the database schema?", result.getNextQuestion().getQuestionText());
    }

    @Test
    void testCompleteSession() {
        InterviewQuestionEntity q1 = InterviewQuestionEntity.builder()
                .id(1L)
                .session(testSession)
                .questionOrder(1)
                .questionText("Tell me about yourself.")
                .category("Introduction")
                .answer(InterviewAnswerEntity.builder()
                        .transcript("I am a software engineer.")
                        .score(85)
                        .build())
                .build();
        testSession.getQuestions().add(q1);

        when(userRepository.findById(100L)).thenReturn(Optional.of(testUser));
        when(sessionRepository.findByIdAndUserId(1L, 100L)).thenReturn(Optional.of(testSession));

        OpenAIInterviewService.FinalReportResult reportResult = new OpenAIInterviewService.FinalReportResult(
                85, 88, 86, 82, 85,
                List.of("Strong Java and OOP", "Clear Communication"),
                List.of("PostgreSQL Concurrency"),
                List.of("Self introduction and Spring Boot architecture"),
                List.of("Database locking"),
                "Candidate performed consistently well.",
                List.of("JPA Locking", "Redis Caching"),
                List.of("Graphs", "Trees"),
                "GOOD",
                "Solid performance! Deepen concurrency knowledge for top-tier roles."
        );

        when(openAIService.synthesizeFinalReport(any(), any(), any(), any(), any(), any()))
                .thenReturn(reportResult);

        when(reportRepository.findBySessionId(1L)).thenReturn(Optional.empty());
        when(reportRepository.save(any(InterviewReportEntity.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(sessionRepository.save(any(InterviewSessionEntity.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        InterviewSessionDto completed = interviewService.completeSession(100L, 1L);

        assertNotNull(completed);
        assertEquals("COMPLETED", completed.getStatus());
        assertEquals(85, completed.getOverallScore());
        assertEquals(88, completed.getTechnicalScore());
        assertEquals(86, completed.getCommunicationScore());
    }
}
