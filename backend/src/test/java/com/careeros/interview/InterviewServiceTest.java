package com.careeros.interview;

import com.careeros.company.CompanyRepository;
import com.careeros.interview.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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
    private InterviewAiService aiService;

    @InjectMocks
    private InterviewServiceImpl interviewService;

    private InterviewSessionEntity testSession;

    @BeforeEach
    void setUp() {
        testSession = InterviewSessionEntity.builder()
                .id(1L)
                .userId(100L)
                .companyName("Amazon")
                .interviewType("TECHNICAL")
                .difficulty("Medium")
                .status("IN_PROGRESS")
                .startedAt(LocalDateTime.now())
                .durationMinutes(30)
                .questions(new ArrayList<>())
                .answers(new ArrayList<>())
                .build();
    }

    @Test
    void testCreateSession() {
        CreateSessionRequest req = CreateSessionRequest.builder()
                .companyName("Amazon")
                .interviewType("TECHNICAL")
                .difficulty("Medium")
                .durationMinutes(30)
                .build();

        when(sessionRepository.save(any(InterviewSessionEntity.class)))
                .thenAnswer(inv -> {
                    InterviewSessionEntity s = inv.getArgument(0);
                    s.setId(1L);
                    return s;
                });

        when(aiService.generateInitialQuestions(any(), any(), any(), any()))
                .thenReturn(List.of(new InterviewAiService.QuestionPlan("What is polymorphism?", "TECHNICAL", "OOP concept", false)));

        InterviewSessionDto result = interviewService.createSession(100L, req);

        assertNotNull(result);
        assertEquals("Amazon", result.getCompanyName());
        assertEquals("IN_PROGRESS", result.getStatus());
        verify(questionRepository, times(1)).save(any(InterviewQuestionEntity.class));
    }

    @Test
    void testSubmitAnswer() {
        InterviewQuestionEntity question = InterviewQuestionEntity.builder()
                .id(5L)
                .session(testSession)
                .questionOrder(1)
                .questionText("Explain caching.")
                .expectedCriteria("Redis/Memcached trade-offs")
                .build();

        SubmitAnswerRequest req = SubmitAnswerRequest.builder()
                .transcript("We use Redis for caching frequent database queries with TTL.")
                .answerDurationSeconds(45)
                .build();

        when(sessionRepository.findByIdAndUserId(1L, 100L)).thenReturn(Optional.of(testSession));
        when(questionRepository.findById(5L)).thenReturn(Optional.of(question));
        when(aiService.evaluateAnswer(any(), any(), any(), any(), any()))
                .thenReturn(new InterviewAiService.AnswerEvaluation(85, "Good answer", "Strong Redis knowledge", "Add TTL detail"));
        when(answerRepository.findByQuestionId(5L)).thenReturn(Optional.empty());
        when(answerRepository.save(any(InterviewAnswerEntity.class)))
                .thenAnswer(inv -> {
                    InterviewAnswerEntity a = inv.getArgument(0);
                    a.setId(10L);
                    return a;
                });

        InterviewAnswerDto result = interviewService.submitAnswer(100L, 1L, 5L, req);

        assertNotNull(result);
        assertEquals(85, result.getScore());
        assertEquals("Good answer", result.getAiEvaluation());
    }
}
