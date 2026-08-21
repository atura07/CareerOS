package com.careeros.interview;

import com.careeros.company.CompanyEntity;
import com.careeros.company.CompanyRepository;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.interview.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewReportRepository reportRepository;
    private final CompanyRepository companyRepository;
    private final InterviewAiService aiService;

    @Override
    public InterviewSessionDto createSession(Long userId, CreateSessionRequest request) {
        CompanyEntity company = null;
        String compName = request.getCompanyName();

        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId()).orElse(null);
            if (company != null) {
                compName = company.getName();
            }
        }

        String type = (request.getInterviewType() != null && !request.getInterviewType().isBlank())
                ? request.getInterviewType().toUpperCase()
                : "TECHNICAL";

        String difficulty = (request.getDifficulty() != null && !request.getDifficulty().isBlank())
                ? request.getDifficulty()
                : "Medium";

        int duration = (request.getDurationMinutes() != null && request.getDurationMinutes() > 0)
                ? request.getDurationMinutes()
                : 30;

        InterviewSessionEntity session = InterviewSessionEntity.builder()
                .userId(userId)
                .company(company)
                .companyName(compName)
                .roleTitle(request.getRoleTitle())
                .interviewType(type)
                .difficulty(difficulty)
                .status("IN_PROGRESS")
                .startedAt(LocalDateTime.now())
                .durationMinutes(duration)
                .questions(new ArrayList<>())
                .answers(new ArrayList<>())
                .build();

        session = sessionRepository.save(session);

        // Generate initial questions from AI Engine
        List<InterviewAiService.QuestionPlan> plans = aiService.generateInitialQuestions(
                compName, request.getRoleTitle(), type, difficulty
        );

        int order = 1;
        for (InterviewAiService.QuestionPlan plan : plans) {
            InterviewQuestionEntity q = InterviewQuestionEntity.builder()
                    .session(session)
                    .questionOrder(order++)
                    .questionText(plan.questionText())
                    .category(plan.category())
                    .expectedCriteria(plan.expectedCriteria())
                    .isAdaptiveFollowUp(plan.isAdaptive())
                    .build();
            questionRepository.save(q);
            session.getQuestions().add(q);
        }

        return InterviewSessionDto.fromEntity(session);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewHistoryDto> getUserHistory(Long userId) {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(userId)
                .stream()
                .map(InterviewHistoryDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewSessionDto getSessionById(Long userId, Long sessionId) {
        InterviewSessionEntity session = sessionRepository.findByIdAndUserIdWithDetails(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));
        return InterviewSessionDto.fromEntity(session);
    }

    @Override
    public InterviewQuestionDto getNextQuestion(Long userId, Long sessionId) {
        InterviewSessionEntity session = sessionRepository.findByIdAndUserIdWithDetails(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        List<InterviewQuestionEntity> questions = session.getQuestions();
        for (InterviewQuestionEntity q : questions) {
            if (q.getAnswer() == null) {
                return InterviewQuestionDto.fromEntity(q);
            }
        }

        // If all current questions answered but under question cap (e.g. 5), generate adaptive follow-up
        if (questions.size() < 5) {
            InterviewQuestionEntity lastQ = questions.get(questions.size() - 1);
            String lastTranscript = (lastQ.getAnswer() != null) ? lastQ.getAnswer().getTranscript() : "";

            InterviewAiService.QuestionPlan followUp = aiService.generateAdaptiveFollowUp(
                    lastQ.getQuestionText(), lastTranscript, session.getInterviewType(), session.getDifficulty(), questions.size() + 1
            );

            InterviewQuestionEntity newQ = InterviewQuestionEntity.builder()
                    .session(session)
                    .questionOrder(questions.size() + 1)
                    .questionText(followUp.questionText())
                    .category(followUp.category())
                    .expectedCriteria(followUp.expectedCriteria())
                    .isAdaptiveFollowUp(true)
                    .build();

            newQ = questionRepository.save(newQ);
            session.getQuestions().add(newQ);
            return InterviewQuestionDto.fromEntity(newQ);
        }

        return null; // All questions completed
    }

    @Override
    public InterviewAnswerDto submitAnswer(Long userId, Long sessionId, Long questionId, SubmitAnswerRequest request) {
        InterviewSessionEntity session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        InterviewQuestionEntity question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        if (!question.getSession().getId().equals(session.getId())) {
            throw new IllegalArgumentException("Question does not belong to session");
        }

        // Evaluate answer via AI Engine
        InterviewAiService.AnswerEvaluation evaluation = aiService.evaluateAnswer(
                question.getQuestionText(),
                question.getExpectedCriteria(),
                request.getTranscript(),
                session.getInterviewType(),
                session.getDifficulty()
        );

        InterviewAnswerEntity answer = answerRepository.findByQuestionId(questionId)
                .orElseGet(() -> InterviewAnswerEntity.builder()
                        .session(session)
                        .question(question)
                        .build());

        answer.setTranscript(request.getTranscript());
        answer.setAnswerDurationSeconds(request.getAnswerDurationSeconds());
        answer.setScore(evaluation.score());
        answer.setAiEvaluation(evaluation.evaluation());
        answer.setStrengths(evaluation.strengths());
        answer.setImprovementAreas(evaluation.improvementAreas());
        answer.setTimestamp(LocalDateTime.now());

        answer = answerRepository.save(answer);
        return InterviewAnswerDto.fromEntity(answer);
    }

    @Override
    public InterviewSessionDto completeSession(Long userId, Long sessionId) {
        InterviewSessionEntity session = sessionRepository.findByIdAndUserIdWithDetails(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        session.setStatus("COMPLETED");
        session.setEndedAt(LocalDateTime.now());

        // Synthesize final comprehensive report
        InterviewAiService.ReportSynthesis synthesis = aiService.synthesizeReport(session);

        session.setOverallScore(synthesis.overallScore());
        session.setTechnicalScore(synthesis.technicalScore());
        session.setCommunicationScore(synthesis.communicationScore());
        session.setAnswerQualityScore(synthesis.answerQualityScore());
        session.setFeedbackSummary(synthesis.summary());

        final InterviewSessionEntity targetSession = session;
        InterviewReportEntity report = reportRepository.findBySessionId(sessionId)
                .orElseGet(() -> InterviewReportEntity.builder().session(targetSession).build());

        report.setOverallStrengths(synthesis.strengthsJson());
        report.setOverallWeaknesses(synthesis.weaknessesJson());
        report.setRecommendations(synthesis.recommendationsJson());
        report.setNextPreparationActions(synthesis.nextActionsJson());

        report = reportRepository.save(report);
        session.setReport(report);
        session = sessionRepository.save(session);

        return InterviewSessionDto.fromEntity(session);
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewReportDto getSessionReport(Long userId, Long sessionId) {
        InterviewSessionEntity session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        InterviewReportEntity report = reportRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found for session: " + sessionId));

        return InterviewReportDto.fromEntity(report);
    }
}
