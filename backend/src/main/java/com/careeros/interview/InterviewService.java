package com.careeros.interview;

import com.careeros.interview.dto.*;

import java.util.List;

public interface InterviewService {

    InterviewSessionDto createSession(Long userId, CreateSessionRequest request);

    List<InterviewHistoryDto> getUserHistory(Long userId);

    InterviewSessionDto getSessionById(Long userId, Long sessionId);

    InterviewQuestionDto getNextQuestion(Long userId, Long sessionId);

    SubmitAnswerResponse submitAnswer(Long userId, Long sessionId, Long questionId, SubmitAnswerRequest request);

    InterviewSessionDto completeSession(Long userId, Long sessionId);

    InterviewReportDto getSessionReport(Long userId, Long sessionId);
}
