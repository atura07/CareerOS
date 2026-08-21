package com.careeros.interview.openai;

import com.careeros.openai.OpenAIClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIInterviewServiceImpl implements OpenAIInterviewService {

    private final OpenAIClient openAIClient;
    private final ObjectMapper objectMapper;

    @Override
    public StartQuestionResult generateStartQuestion(
            String candidateName,
            String companyName,
            String roleTitle,
            String interviewType,
            String difficulty) {

        String effectiveCandidateName = (candidateName != null && !candidateName.isBlank()) ? candidateName : "Candidate";
        String effectiveCompany = (companyName != null && !companyName.isBlank()) ? companyName : "Top Tech Company";
        String effectiveRole = (roleTitle != null && !roleTitle.isBlank()) ? roleTitle : "Software Engineer";

        String systemPrompt = """
            You are a professional, realistic, and friendly technical hiring manager and interviewer conducting a placement job interview for %s at %s.
            Difficulty level: %s. Interview Track: %s.

            Your goal is to start the interview naturally and conversationally.
            Do NOT show multiple questions. Ask only ONE opening introductory question.

            You MUST respond in valid JSON with this exact schema:
            {
              "interviewerGreeting": "Hi [CandidateName], welcome to your mock interview for [Role] at [Company].",
              "question": "To get started, could you please tell me about yourself, your educational background, and what key technical projects you've been working on recently?",
              "topic": "Background & Self Introduction",
              "stage": "INTRODUCTION",
              "reason": "Icebreaker to establish background and identify candidate-chosen technologies and projects for deep-dive questioning."
            }
            """.formatted(effectiveRole, effectiveCompany, difficulty, interviewType);

        List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content",
                        "Please start the interview for candidate " + effectiveCandidateName +
                        " applying for " + effectiveRole + " at " + effectiveCompany + ".")
        );

        try {
            String jsonResponse = openAIClient.executeChatCompletion(systemPrompt, messages, 0.7);
            JsonNode root = objectMapper.readTree(jsonResponse);

            return new StartQuestionResult(
                    root.path("interviewerGreeting").asText("Welcome to your mock interview for " + effectiveRole + " at " + effectiveCompany + "."),
                    root.path("question").asText("Hi " + effectiveCandidateName + ", could you please introduce yourself and tell me about the technologies and projects you've been working on?"),
                    root.path("topic").asText("Background & Self Introduction"),
                    root.path("stage").asText("INTRODUCTION"),
                    root.path("reason").asText("Opening self-introduction")
            );
        } catch (Exception e) {
            log.error("[OpenAI] Failed to generate starting interview question: {}", e.getMessage(), e);
            throw new IllegalStateException("OpenAI Interview Error: " + e.getMessage(), e);
        }
    }

    @Override
    public ConversationalResponse evaluateAndGenerateNextQuestion(
            String candidateName,
            String companyName,
            String roleTitle,
            String interviewType,
            String difficulty,
            String currentStage,
            List<ConversationTurn> history,
            String currentQuestionText,
            String candidateAnswer) {

        String effectiveCandidate = (candidateName != null && !candidateName.isBlank()) ? candidateName : "Candidate";
        String effectiveCompany = (companyName != null && !companyName.isBlank()) ? companyName : "Tech Company";
        String effectiveRole = (roleTitle != null && !roleTitle.isBlank()) ? roleTitle : "Software Engineer";

        String systemPrompt = """
            You are a professional technical interviewer conducting a realistic job interview for %s at %s.
            Candidate: %s. Difficulty: %s. Track: %s.

            AI INTERVIEWER BEHAVIOR & RULES:
            1. You are having a REAL, natural conversation. You do NOT follow a fixed question list.
            2. You MUST remember the entire interview context and listen carefully to candidate answers.
            3. Ask intelligent follow-up questions directly based on:
               - Technologies they mention (e.g. Java, Python, React, Spring Boot, Postgres, Redis, Docker, Kafka)
               - Projects they describe (architecture, design decisions, bottlenecks, concurrency, schema)
               - Concepts they explain incorrectly or incompletely (ask for clarification or edge cases)
               - Strengths they demonstrate (increase depth and scale)
               - Weaknesses they reveal (probe fundamentals or provide an opportunity to clarify)
            4. Intelligently move through the natural interview progression:
               - STAGE 1: INTRODUCTION (Background & self-introduction)
               - STAGE 2: PROJECT (Deep-dive into candidate-mentioned projects, architectures, tradeoffs)
               - STAGE 3: TECHNICAL (Core CS: OOP, DBMS, SQL, OS, Computer Networks, REST APIs, Backend/Frontend)
               - STAGE 4: DSA (Problem solving, data structures, algorithms, time/space complexities, optimizations)
               - STAGE 5: BEHAVIORAL (STAR framework, challenges, team collaboration, engineering values)
               - STAGE 6: COMPLETE (Wrap up)
            5. Ask only ONE question at a time.
            6. Do NOT reveal future questions or the entire interview plan.
            7. Adapt difficulty dynamically: if candidate gives strong answers, increase technical rigor; if weak, ask a probing or clarifying question.
            8. Evaluate the candidate's latest answer internally across technical correctness, clarity, communication, and completeness.
            9. Provide a concise, constructive `briefFeedback` (1-2 sentences) for immediate lightweight feedback.

            You MUST respond in valid JSON matching this schema:
            {
              "candidateAnswerEvaluation": {
                "score": 85,
                "technicalAccuracy": 85,
                "clarity": 90,
                "communication": 85,
                "completeness": 80,
                "strengths": ["Clear explanation of component architecture", "Good understanding of dependency injection"],
                "weaknesses": ["Did not mention transaction rollback or isolation levels"],
                "briefFeedback": "Good answer — strong grasp of backend architecture; be sure to highlight database transaction handling."
              },
              "interviewState": {
                "currentStage": "PROJECT",
                "difficulty": "MEDIUM",
                "shouldContinue": true
              },
              "nextQuestion": {
                "question": "You mentioned using Spring Boot and PostgreSQL for your e-commerce project. How did you design the schema for orders and inventory, and how did you prevent race conditions during concurrent checkouts?",
                "topic": "Database Schema & Concurrency",
                "reason": "Follow-up on candidate's project mention to test concurrency control and transactional integrity."
              }
            }
            """.formatted(effectiveRole, effectiveCompany, effectiveCandidate, difficulty, interviewType);

        List<Map<String, String>> messages = new ArrayList<>();

        // Add conversation history
        if (history != null) {
            for (ConversationTurn turn : history) {
                if (turn.question() != null && !turn.question().isBlank()) {
                    messages.add(Map.of("role", "assistant", "content", turn.question()));
                }
                if (turn.answer() != null && !turn.answer().isBlank()) {
                    messages.add(Map.of("role", "user", "content", turn.answer()));
                }
            }
        }

        // Add the current question and the candidate's latest answer
        if (currentQuestionText != null && !currentQuestionText.isBlank()) {
            messages.add(Map.of("role", "assistant", "content", currentQuestionText));
        }
        messages.add(Map.of("role", "user", "content", candidateAnswer));

        try {
            String jsonResponse = openAIClient.executeChatCompletion(systemPrompt, messages, 0.7);
            JsonNode root = objectMapper.readTree(jsonResponse);

            JsonNode evalNode = root.path("candidateAnswerEvaluation");
            List<String> strengths = new ArrayList<>();
            if (evalNode.path("strengths").isArray()) {
                evalNode.path("strengths").forEach(s -> strengths.add(s.asText()));
            }
            List<String> weaknesses = new ArrayList<>();
            if (evalNode.path("weaknesses").isArray()) {
                evalNode.path("weaknesses").forEach(w -> weaknesses.add(w.asText()));
            }

            CandidateEvaluation evaluation = new CandidateEvaluation(
                    evalNode.path("score").asInt(75),
                    evalNode.path("technicalAccuracy").asInt(75),
                    evalNode.path("clarity").asInt(75),
                    evalNode.path("communication").asInt(75),
                    evalNode.path("completeness").asInt(75),
                    strengths,
                    weaknesses,
                    evalNode.path("briefFeedback").asText("Thank you for your response.")
            );

            JsonNode stateNode = root.path("interviewState");
            InterviewState state = new InterviewState(
                    stateNode.path("currentStage").asText(currentStage != null ? currentStage : "TECHNICAL"),
                    stateNode.path("difficulty").asText(difficulty),
                    stateNode.path("shouldContinue").asBoolean(true)
            );

            JsonNode nextQNode = root.path("nextQuestion");
            NextQuestion nextQuestion = new NextQuestion(
                    nextQNode.path("question").asText("Could you elaborate on how you handled scalability and performance optimization?"),
                    nextQNode.path("topic").asText("System Scalability & Performance"),
                    nextQNode.path("reason").asText("Drilling deeper into technical design tradeoffs")
            );

            return new ConversationalResponse(evaluation, state, nextQuestion);

        } catch (Exception e) {
            log.error("[OpenAI] Error during answer evaluation and next question generation: {}", e.getMessage(), e);
            throw new IllegalStateException("OpenAI Interview Error: " + e.getMessage(), e);
        }
    }

    @Override
    public FinalReportResult synthesizeFinalReport(
            String candidateName,
            String companyName,
            String roleTitle,
            String interviewType,
            String difficulty,
            List<ConversationTurn> history) {

        String effectiveCandidate = (candidateName != null && !candidateName.isBlank()) ? candidateName : "Candidate";
        String effectiveCompany = (companyName != null && !companyName.isBlank()) ? companyName : "Target Company";
        String effectiveRole = (roleTitle != null && !roleTitle.isBlank()) ? roleTitle : "Software Engineer";

        String systemPrompt = """
            You are the Senior Bar Raiser / Hiring Committee Lead evaluating a candidate's complete mock interview.
            Candidate: %s
            Role: %s at %s
            Difficulty: %s
            Interview Type: %s

            Analyze the ENTIRE conversation history provided in the messages.
            Synthesize a realistic, comprehensive, and deeply constructive final report.

            Evaluate:
            - Overall Score (0-100)
            - Technical Knowledge Score (0-100)
            - Communication & Clarity Score (0-100)
            - Problem Solving & DSA Score (0-100)
            - Project Architecture & Practical Understanding Score (0-100)
            - Strongest Skills (array of strings)
            - Weakest Areas (array of strings)
            - Questions Answered Well (array of strings)
            - Questions Needing Improvement (array of strings)
            - Detailed Feedback (multi-paragraph breakdown)
            - Top 5 Topics To Study Next (concrete topics e.g. "PostgreSQL Transaction Isolation Levels", "B-Tree Indexing", "Dynamic Programming on Trees")
            - Recommended DSA Topics (array of strings)
            - Interview Readiness Level (strictly one of: "NOT READY", "DEVELOPING", "GOOD", "INTERVIEW READY")
            - Personalized Final Message (e.g. "You demonstrated good knowledge of Java and OOP. However, your answers on DBMS normalization and operating systems need more depth. Before your next interview, focus on...")

            You MUST respond in valid JSON with this schema:
            {
              "overallScore": 84,
              "technicalScore": 85,
              "communicationScore": 88,
              "problemSolvingScore": 80,
              "projectScore": 86,
              "strongestSkills": ["Java Core & OOP", "Spring Boot REST Architecture", "Clean Communication"],
              "weakestAreas": ["Distributed System Caching", "PostgreSQL Concurrency & Locking"],
              "questionsAnsweredWell": ["Project architectural overview", "Encapsulation and Polymorphism explanation"],
              "questionsNeedingImprovement": ["Handling race conditions in checkout", "B-Tree vs Hash indexing tradeoffs"],
              "detailedFeedback": "The candidate communicated clearly and showed strong practical experience with Spring Boot and Java...",
              "top5TopicsToStudyNext": ["Optimistic vs Pessimistic Locking in JPA", "Redis Caching Strategies", "Database Index Internals", "REST API Idempotency", "System Design Fundamentals"],
              "recommendedDsaTopics": ["Graph BFS/DFS & Dijkstra", "Tree Traversals", "Sliding Window Problems"],
              "interviewReadiness": "GOOD",
              "personalizedMessage": "You demonstrated solid knowledge in backend engineering and good problem-solving instincts. To reach top-tier placement readiness for Google/Amazon, deepen your mastery of database transactions and distributed caching."
            }
            """.formatted(effectiveCandidate, effectiveRole, effectiveCompany, difficulty, interviewType);

        StringBuilder sb = new StringBuilder();
        sb.append("Here is the complete interview transcript:\n\n");
        if (history != null) {
            int idx = 1;
            for (ConversationTurn turn : history) {
                sb.append("--- Turn ").append(idx++).append(" [Stage: ").append(turn.stage()).append("] ---\n");
                sb.append("Interviewer Question: ").append(turn.question()).append("\n");
                sb.append("Candidate Answer: ").append(turn.answer()).append("\n");
                if (turn.score() != null) {
                    sb.append("Turn Score: ").append(turn.score()).append("/100\n");
                }
                sb.append("\n");
            }
        }

        List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", sb.toString())
        );

        try {
            String jsonResponse = openAIClient.executeChatCompletion(systemPrompt, messages, 0.5);
            JsonNode root = objectMapper.readTree(jsonResponse);

            List<String> strongestSkills = new ArrayList<>();
            if (root.path("strongestSkills").isArray()) {
                root.path("strongestSkills").forEach(n -> strongestSkills.add(n.asText()));
            }

            List<String> weakestAreas = new ArrayList<>();
            if (root.path("weakestAreas").isArray()) {
                root.path("weakestAreas").forEach(n -> weakestAreas.add(n.asText()));
            }

            List<String> questionsAnsweredWell = new ArrayList<>();
            if (root.path("questionsAnsweredWell").isArray()) {
                root.path("questionsAnsweredWell").forEach(n -> questionsAnsweredWell.add(n.asText()));
            }

            List<String> questionsNeedingImprovement = new ArrayList<>();
            if (root.path("questionsNeedingImprovement").isArray()) {
                root.path("questionsNeedingImprovement").forEach(n -> questionsNeedingImprovement.add(n.asText()));
            }

            List<String> top5TopicsToStudyNext = new ArrayList<>();
            if (root.path("top5TopicsToStudyNext").isArray()) {
                root.path("top5TopicsToStudyNext").forEach(n -> top5TopicsToStudyNext.add(n.asText()));
            }

            List<String> recommendedDsaTopics = new ArrayList<>();
            if (root.path("recommendedDsaTopics").isArray()) {
                root.path("recommendedDsaTopics").forEach(n -> recommendedDsaTopics.add(n.asText()));
            }

            return new FinalReportResult(
                    root.path("overallScore").asInt(80),
                    root.path("technicalScore").asInt(80),
                    root.path("communicationScore").asInt(80),
                    root.path("problemSolvingScore").asInt(80),
                    root.path("projectScore").asInt(80),
                    strongestSkills,
                    weakestAreas,
                    questionsAnsweredWell,
                    questionsNeedingImprovement,
                    root.path("detailedFeedback").asText("Overall solid performance."),
                    top5TopicsToStudyNext,
                    recommendedDsaTopics,
                    root.path("interviewReadiness").asText("GOOD"),
                    root.path("personalizedMessage").asText("Great effort! Keep practicing core CS and DSA.")
            );

        } catch (Exception e) {
            log.error("[OpenAI] Error synthesizing final interview report: {}", e.getMessage(), e);
            throw new IllegalStateException("OpenAI Report Error: " + e.getMessage(), e);
        }
    }
}
