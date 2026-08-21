package com.careeros.interview;

import com.careeros.company.CompanyEntity;
import com.careeros.company.CompanyRepository;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.interview.dto.*;
import com.careeros.interview.openai.OpenAIInterviewService;
import com.careeros.user.User;
import com.careeros.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final UserRepository userRepository;
    private final OpenAIInterviewService openAIService;
    private final ObjectMapper objectMapper;

    @Override
    public InterviewSessionDto createSession(Long userId, CreateSessionRequest request) {
        log.info("[INTERVIEW] Creating conversational mock interview session for userId={}", userId);

        CompanyEntity company = null;
        String compName = request.getCompanyName();

        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId()).orElse(null);
            if (company != null) {
                compName = company.getName();
            }
        }

        String candidateName = "Candidate";
        if (userId != null) {
            candidateName = userRepository.findById(userId)
                    .map(User::getFullName)
                    .orElse("Candidate");
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
                .currentStage("INTRODUCTION")
                .startedAt(LocalDateTime.now())
                .durationMinutes(duration)
                .questions(new ArrayList<>())
                .answers(new ArrayList<>())
                .build();

        session = sessionRepository.save(session);

        // Generate opening conversational question via OpenAI
        OpenAIInterviewService.StartQuestionResult startResult = openAIService.generateStartQuestion(
                candidateName,
                compName,
                request.getRoleTitle(),
                type,
                difficulty
        );

        InterviewQuestionEntity initialQuestion = InterviewQuestionEntity.builder()
                .session(session)
                .questionOrder(1)
                .questionText(startResult.question())
                .category(startResult.topic())
                .expectedCriteria(startResult.reason())
                .isAdaptiveFollowUp(false)
                .build();

        initialQuestion = questionRepository.save(initialQuestion);
        session.getQuestions().add(initialQuestion);

        log.info("[INTERVIEW] Initialized session id={} with opening question: {}", session.getId(), initialQuestion.getQuestionText());

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
        InterviewSessionEntity session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));
        if (session.getQuestions() != null) session.getQuestions().size();
        if (session.getAnswers() != null) session.getAnswers().size();
        return InterviewSessionDto.fromEntity(session);
    }

    @Override
    public InterviewQuestionDto getNextQuestion(Long userId, Long sessionId) {
        InterviewSessionEntity session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        List<InterviewQuestionEntity> questions = session.getQuestions();
        for (InterviewQuestionEntity q : questions) {
            if (q.getAnswer() == null) {
                return InterviewQuestionDto.fromEntity(q);
            }
        }
        return null;
    }

    @Override
    public SubmitAnswerResponse submitAnswer(Long userId, Long sessionId, Long questionId, SubmitAnswerRequest request) {
        log.info("[INTERVIEW] Submitting answer for sessionId={}, questionId={}", sessionId, questionId);

        InterviewSessionEntity session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        InterviewQuestionEntity currentQuestion = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        if (!currentQuestion.getSession().getId().equals(session.getId())) {
            throw new IllegalArgumentException("Question does not belong to session");
        }

        String candidateName = userRepository.findById(userId)
                .map(User::getFullName)
                .orElse("Candidate");

        // Build complete conversation history up to this question
        List<OpenAIInterviewService.ConversationTurn> history = new ArrayList<>();
        if (session.getQuestions() != null) {
            for (InterviewQuestionEntity q : session.getQuestions()) {
                if (!q.getId().equals(questionId) && q.getAnswer() != null) {
                    history.add(new OpenAIInterviewService.ConversationTurn(
                            q.getQuestionText(),
                            q.getAnswer().getTranscript(),
                            q.getCategory(),
                            q.getAnswer().getScore()
                    ));
                }
            }
        }

        // Call OpenAI to evaluate candidate answer and generate the next dynamic follow-up question
        OpenAIInterviewService.ConversationalResponse aiResponse = openAIService.evaluateAndGenerateNextQuestion(
                candidateName,
                session.getCompanyName(),
                session.getRoleTitle(),
                session.getInterviewType(),
                session.getDifficulty(),
                session.getCurrentStage(),
                history,
                currentQuestion.getQuestionText(),
                request.getTranscript()
        );

        OpenAIInterviewService.CandidateEvaluation eval = aiResponse.candidateAnswerEvaluation();
        OpenAIInterviewService.InterviewState state = aiResponse.interviewState();
        OpenAIInterviewService.NextQuestion nextQData = aiResponse.nextQuestion();

        // Update session stage
        if (state.currentStage() != null && !state.currentStage().isBlank()) {
            session.setCurrentStage(state.currentStage());
        }

        // Save or update candidate answer
        InterviewAnswerEntity answer = answerRepository.findByQuestionId(questionId)
                .orElseGet(() -> InterviewAnswerEntity.builder()
                        .session(session)
                        .question(currentQuestion)
                        .build());

        answer.setTranscript(request.getTranscript());
        answer.setAnswerDurationSeconds(request.getAnswerDurationSeconds());
        answer.setScore(eval.score());
        answer.setAiEvaluation(eval.briefFeedback());

        try {
            answer.setStrengths(objectMapper.writeValueAsString(eval.strengths()));
            answer.setImprovementAreas(objectMapper.writeValueAsString(eval.weaknesses()));
        } catch (Exception e) {
            answer.setStrengths("[]");
            answer.setImprovementAreas("[]");
        }
        answer.setTimestamp(LocalDateTime.now());
        answer = answerRepository.save(answer);
        currentQuestion.setAnswer(answer);

        // Dynamically create and persist next question if interview should continue (capped at 10 turns max)
        InterviewQuestionDto nextQuestionDto = null;
        int currentQuestionCount = session.getQuestions() != null ? session.getQuestions().size() : 1;

        if (state.shouldContinue() && currentQuestionCount < 10) {
            InterviewQuestionEntity nextQuestionEntity = InterviewQuestionEntity.builder()
                    .session(session)
                    .questionOrder(currentQuestionCount + 1)
                    .questionText(nextQData.question())
                    .category(nextQData.topic())
                    .expectedCriteria(nextQData.reason())
                    .isAdaptiveFollowUp(true)
                    .build();

            nextQuestionEntity = questionRepository.save(nextQuestionEntity);
            session.getQuestions().add(nextQuestionEntity);
            nextQuestionDto = InterviewQuestionDto.fromEntity(nextQuestionEntity);
            log.info("[INTERVIEW] Generated next dynamic question #{} in stage [{}]: {}",
                    nextQuestionEntity.getQuestionOrder(), session.getCurrentStage(), nextQuestionEntity.getQuestionText());
        } else {
            log.info("[INTERVIEW] Interview stage completed or question limit reached.");
        }

        sessionRepository.save(session);

        return SubmitAnswerResponse.builder()
                .answer(InterviewAnswerDto.fromEntity(answer))
                .evaluation(SubmitAnswerResponse.CandidateEvaluationDto.builder()
                        .score(eval.score())
                        .technicalAccuracy(eval.technicalAccuracy())
                        .clarity(eval.clarity())
                        .communication(eval.communication())
                        .completeness(eval.completeness())
                        .strengths(eval.strengths())
                        .weaknesses(eval.weaknesses())
                        .briefFeedback(eval.briefFeedback())
                        .build())
                .interviewState(SubmitAnswerResponse.InterviewStateDto.builder()
                        .currentStage(session.getCurrentStage())
                        .difficulty(session.getDifficulty())
                        .shouldContinue(state.shouldContinue() && currentQuestionCount < 10)
                        .build())
                .nextQuestion(nextQuestionDto)
                .build();
    }

    @Override
    public InterviewSessionDto completeSession(Long userId, Long sessionId) {
        log.info("[INTERVIEW] Completing session id={} for userId={}", sessionId, userId);

        InterviewSessionEntity session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        session.setStatus("COMPLETED");
        session.setCurrentStage("COMPLETE");
        session.setEndedAt(LocalDateTime.now());

        String candidateName = userRepository.findById(userId)
                .map(User::getFullName)
                .orElse("Candidate");

        // Build full conversation history for comprehensive OpenAI report synthesis
        List<OpenAIInterviewService.ConversationTurn> history = new ArrayList<>();
        if (session.getQuestions() != null) {
            for (InterviewQuestionEntity q : session.getQuestions()) {
                if (q.getAnswer() != null) {
                    history.add(new OpenAIInterviewService.ConversationTurn(
                            q.getQuestionText(),
                            q.getAnswer().getTranscript(),
                            q.getCategory(),
                            q.getAnswer().getScore()
                    ));
                }
            }
        }

        // Synthesize full report with OpenAI
        OpenAIInterviewService.FinalReportResult reportResult = openAIService.synthesizeFinalReport(
                candidateName,
                session.getCompanyName(),
                session.getRoleTitle(),
                session.getInterviewType(),
                session.getDifficulty(),
                history
        );

        session.setOverallScore(reportResult.overallScore());
        session.setTechnicalScore(reportResult.technicalScore());
        session.setCommunicationScore(reportResult.communicationScore());
        session.setProblemSolvingScore(reportResult.problemSolvingScore());
        session.setProjectScore(reportResult.projectScore());
        session.setAnswerQualityScore((reportResult.technicalScore() + reportResult.communicationScore()) / 2);
        session.setFeedbackSummary(reportResult.personalizedMessage());

        final InterviewSessionEntity targetSession = session;
        InterviewReportEntity report = reportRepository.findBySessionId(sessionId)
                .orElseGet(() -> InterviewReportEntity.builder().session(targetSession).build());

        try {
            report.setOverallStrengths(objectMapper.writeValueAsString(reportResult.strongestSkills()));
            report.setOverallWeaknesses(objectMapper.writeValueAsString(reportResult.weakestAreas()));
            report.setQuestionsAnsweredWell(objectMapper.writeValueAsString(reportResult.questionsAnsweredWell()));
            report.setQuestionsNeedingImprovement(objectMapper.writeValueAsString(reportResult.questionsNeedingImprovement()));
            report.setDetailedFeedback(reportResult.detailedFeedback());
            report.setRecommendations(objectMapper.writeValueAsString(reportResult.top5TopicsToStudyNext()));
            report.setNextPreparationActions(objectMapper.writeValueAsString(reportResult.top5TopicsToStudyNext()));
            report.setRecommendedDsaTopics(objectMapper.writeValueAsString(reportResult.recommendedDsaTopics()));
            report.setInterviewReadiness(reportResult.interviewReadiness());
            report.setPersonalizedMessage(reportResult.personalizedMessage());
        } catch (Exception e) {
            log.warn("[INTERVIEW] Failed to serialize report JSON lists: {}", e.getMessage());
        }

        report = reportRepository.save(report);
        session.setReport(report);
        session = sessionRepository.save(session);

        log.info("[INTERVIEW] Session id={} completed. Overall Score: {}/100, Readiness: {}",
                session.getId(), session.getOverallScore(), report.getInterviewReadiness());

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
