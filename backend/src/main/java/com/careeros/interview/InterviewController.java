package com.careeros.interview;

import com.careeros.interview.dto.*;
import com.careeros.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<InterviewSessionDto> createSession(
            @RequestBody CreateSessionRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(interviewService.createSession(user.getId(), request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewHistoryDto>> getUserHistory(
            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(interviewService.getUserHistory(user.getId()));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSessionDto> getSession(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(interviewService.getSessionById(user.getId(), sessionId));
    }

    @GetMapping("/{sessionId}/questions/next")
    public ResponseEntity<InterviewQuestionDto> getNextQuestion(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        InterviewQuestionDto nextQ = interviewService.getNextQuestion(user.getId(), sessionId);
        return ResponseEntity.ok(nextQ);
    }

    @PostMapping("/{sessionId}/questions/{questionId}/answer")
    public ResponseEntity<InterviewAnswerDto> submitAnswer(
            @PathVariable Long sessionId,
            @PathVariable Long questionId,
            @RequestBody SubmitAnswerRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(interviewService.submitAnswer(user.getId(), sessionId, questionId, request));
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<InterviewSessionDto> completeSession(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(interviewService.completeSession(user.getId(), sessionId));
    }

    @GetMapping("/{sessionId}/report")
    public ResponseEntity<InterviewReportDto> getSessionReport(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(interviewService.getSessionReport(user.getId(), sessionId));
    }
}
