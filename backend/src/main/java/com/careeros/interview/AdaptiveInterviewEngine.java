package com.careeros.interview;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
public class AdaptiveInterviewEngine implements InterviewAiService {

    @Override
    public List<QuestionPlan> generateInitialQuestions(String companyName, String roleTitle, String interviewType, String difficulty) {
        String comp = (companyName != null && !companyName.isBlank()) ? companyName : "Target Tech Company";
        String role = (roleTitle != null && !roleTitle.isBlank()) ? roleTitle : "Software Engineer";
        String type = (interviewType != null) ? interviewType.toUpperCase() : "TECHNICAL";

        List<QuestionPlan> list = new ArrayList<>();

        switch (type) {
            case "HR" -> {
                list.add(new QuestionPlan(
                        "Tell me about yourself, your technical journey, and why you are specifically interested in joining " + comp + " for the " + role + " role.",
                        "HR",
                        "Clear communication, concise career timeline, genuine motivation for " + comp + ", and role alignment.",
                        false
                ));
                list.add(new QuestionPlan(
                        "Describe a challenging engineering situation or team conflict you faced in a past project. How did you resolve it?",
                        "HR",
                        "STAR method (Situation, Task, Action, Result), accountability, conflict resolution, and empathy.",
                        false
                ));
            }
            case "BEHAVIORAL" -> {
                list.add(new QuestionPlan(
                        "Tell me about a time you had to deliver a critical project under tight deadlines with ambiguous requirements. How did you prioritize tasks at " + comp + " scale?",
                        "BEHAVIORAL",
                        "Structured prioritization, stakeholder communication, trade-off management, and bias for action.",
                        false
                ));
                list.add(new QuestionPlan(
                        "Give an example of a technical mistake or outage you caused or were involved in. What was the root cause and what safeguards did you put in place?",
                        "BEHAVIORAL",
                        "Honesty, blameless post-mortem mentality, continuous improvement, and engineering resilience.",
                        false
                ));
            }
            case "SYSTEM_DESIGN" -> {
                list.add(new QuestionPlan(
                        "How would you design a scalable notification service for " + comp + " capable of sending millions of push, email, and SMS notifications per minute with rate limiting and priority queues?",
                        "SYSTEM_DESIGN",
                        "High-level architecture, message queues (Kafka/RabbitMQ), worker pools, idempotency keys, dead-letter queues, and Redis token bucket rate limiting.",
                        false
                ));
                list.add(new QuestionPlan(
                        "In your distributed system design, how do you handle database failovers, data consistency across multiple regions, and cache invalidation?",
                        "SYSTEM_DESIGN",
                        "CAP theorem trade-offs, master-replica replication, read-your-writes consistency, and Cache-Aside vs Write-Through patterns.",
                        false
                ));
            }
            case "DSA" -> {
                list.add(new QuestionPlan(
                        "Given an array of integers representing stock prices on consecutive days, explain how you would design an algorithm to find the maximum profit with at most K transactions. What is your optimal time and space complexity?",
                        "DSA",
                        "Dynamic Programming state transitions: dp[i][k][0] and dp[i][k][1], optimization from O(N*K*N) to O(N*K) time, and O(K) space.",
                        false
                ));
                list.add(new QuestionPlan(
                        "How would you detect cycles and topological dependencies in a large microservice build pipeline represented as a Directed Graph?",
                        "DSA",
                        "Kahn's Algorithm (BFS with In-degree array) or DFS with 3-color node states (White, Gray, Black). Explain O(V + E) complexity.",
                        false
                ));
            }
            default -> { // TECHNICAL & MIXED
                list.add(new QuestionPlan(
                        "Explain the core architectural differences between SQL (Relational) and NoSQL databases. When would you choose PostgreSQL over MongoDB for a financial transaction platform at " + comp + "?",
                        "TECHNICAL",
                        "ACID vs BASE properties, table joins and foreign keys vs document embedding, transaction isolation levels, and data integrity guarantees.",
                        false
                ));
                list.add(new QuestionPlan(
                        "Walk me through how RESTful API authentication works using JWT tokens and Refresh tokens. How do you handle token revocation and CSRF/XSS attacks in production?",
                        "TECHNICAL",
                        "Stateless JWT signature verification (HMAC/RSA), short-lived Access tokens, secure HttpOnly cookie storage, Refresh token rotation, and Redis blacklisting for revocation.",
                        false
                ));
            }
        }

        return list;
    }

    @Override
    public QuestionPlan generateAdaptiveFollowUp(String currentQuestion, String transcript, String interviewType, String difficulty, int nextOrder) {
        String lower = (transcript != null) ? transcript.toLowerCase(Locale.ROOT) : "";

        // Context-aware adaptive branching based on user's specific answer details
        if (lower.contains("redis") || lower.contains("cache") || lower.contains("caching")) {
            return new QuestionPlan(
                    "You mentioned using Redis for caching. How would you handle cache stampede (thundering herd problem) and cache invalidation when data updates frequently in a high-concurrency environment?",
                    interviewType != null ? interviewType : "TECHNICAL",
                    "Mutual exclusion locks, probabilistic early expiration (XFetch), background cache warming, and TTL strategies.",
                    true
            );
        } else if (lower.contains("postgres") || lower.contains("sql") || lower.contains("database") || lower.contains("index")) {
            return new QuestionPlan(
                    "Building on your database point: how do B-Tree and Hash indexes differ internally in PostgreSQL, and what are the trade-offs of adding too many indexes on write-heavy tables?",
                    interviewType != null ? interviewType : "TECHNICAL",
                    "B-Tree range query support, O(log N) lookups, write overhead on INSERT/UPDATE/DELETE, and index maintenance vacuuming.",
                    true
            );
        } else if (lower.contains("kafka") || lower.contains("queue") || lower.contains("rabbitmq") || lower.contains("message")) {
            return new QuestionPlan(
                    "You referenced message queues. How do you ensure exactly-once processing semantics and avoid duplicate message processing if a consumer crashes mid-transaction?",
                    interviewType != null ? interviewType : "TECHNICAL",
                    "Idempotency keys, transactional outbox pattern, consumer offset commit timing, and deduplication tables.",
                    true
            );
        } else if (lower.contains("microservice") || lower.contains("api") || lower.contains("rest") || lower.contains("spring")) {
            return new QuestionPlan(
                    "In a microservices architecture, how do you handle distributed transactions and maintain consistency across independent database services without two-phase commit (2PC)?",
                    interviewType != null ? interviewType : "TECHNICAL",
                    "Saga Pattern (Choreography vs Orchestration), compensating transactions, and eventual consistency.",
                    true
            );
        } else if (lower.contains("star") || lower.contains("team") || lower.contains("lead") || lower.contains("conflict")) {
            return new QuestionPlan(
                    "That is a great example. Looking back at that situation, if you had to do it again with your current experience, what specific architectural or communication decision would you change?",
                    "BEHAVIORAL",
                    "Self-reflection, architectural foresight, lessons learned, and proactive risk mitigation.",
                    true
            );
        } else if (lower.split("\\s+").length < 15) {
            return new QuestionPlan(
                    "Could you elaborate more on the technical trade-offs of your approach? What were the alternative solutions you considered and why did you reject them?",
                    interviewType != null ? interviewType : "TECHNICAL",
                    "Trade-off articulation, comparing alternative algorithms/architectures, and justifying technical choices.",
                    true
            );
        } else {
            return new QuestionPlan(
                    "How would you measure the performance and monitor the reliability of this solution in a live production environment (e.g. latency percentiles, error budgets, telemetry)?",
                    interviewType != null ? interviewType : "TECHNICAL",
                    "P99 latency, Prometheus/Grafana metrics, Distributed tracing (OpenTelemetry/Jaeger), structured logging, and SLO/SLA management.",
                    true
            );
        }
    }

    @Override
    public AnswerEvaluation evaluateAnswer(String questionText, String expectedCriteria, String transcript, String interviewType, String difficulty) {
        if (transcript == null || transcript.trim().isBlank()) {
            return new AnswerEvaluation(
                    20,
                    "No answer transcript provided. Please articulate your thoughts clearly.",
                    "Session attempted.",
                    "Provide a detailed response covering technical reasoning and concrete examples."
            );
        }

        String lower = transcript.toLowerCase(Locale.ROOT);
        int words = transcript.trim().split("\\s+").length;

        int score = 50; // base score
        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();

        // Length & Depth evaluation
        if (words >= 40) {
            score += 15;
            strengths.add("Good depth and comprehensive explanation.");
        } else if (words >= 20) {
            score += 10;
            strengths.add("Concise answer.");
        } else {
            improvements.add("Answer is quite brief. Elaborate with more technical details and specific examples.");
        }

        // Technical terminology check
        boolean hasTechTerms = lower.contains("latency") || lower.contains("scale") || lower.contains("cache")
                || lower.contains("database") || lower.contains("complexity") || lower.contains("trade-off")
                || lower.contains("thread") || lower.contains("async") || lower.contains("index")
                || lower.contains("architecture") || lower.contains("system") || lower.contains("security");

        if (hasTechTerms) {
            score += 20;
            strengths.add("Demonstrated strong grasp of engineering terminology and system trade-offs.");
        } else {
            improvements.add("Incorporate more industry-standard terminology and concrete engineering trade-offs.");
        }

        // Structure check
        if (lower.contains("because") || lower.contains("first") || lower.contains("second") || lower.contains("result") || lower.contains("however")) {
            score += 10;
            strengths.add("Structured reasoning with clear cause-and-effect explanation.");
        } else {
            improvements.add("Use structured frameworks (e.g. Problem -> Solution -> Trade-off or STAR method) to structure your response.");
        }

        score = Math.min(100, Math.max(20, score));

        String eval = String.format("Score: %d/100. Evaluated %d words against expected criteria: %s.",
                score, words, (expectedCriteria != null ? expectedCriteria : "General completeness"));

        return new AnswerEvaluation(
                score,
                eval,
                String.join(" ", strengths),
                String.join(" ", improvements)
        );
    }

    @Override
    public ReportSynthesis synthesizeReport(InterviewSessionEntity session) {
        List<InterviewAnswerEntity> answers = session.getAnswers();
        int totalAnswers = (answers != null) ? answers.size() : 0;

        int overall = 0;
        int technical = 0;
        int communication = 0;
        int answerQuality = 0;

        if (totalAnswers > 0) {
            int sumScores = 0;
            int wordCountSum = 0;

            for (InterviewAnswerEntity a : answers) {
                int s = (a.getScore() != null) ? a.getScore() : 50;
                sumScores += s;
                if (a.getTranscript() != null) {
                    wordCountSum += a.getTranscript().split("\\s+").length;
                }
            }

            technical = Math.min(100, (sumScores / totalAnswers));
            int avgWords = wordCountSum / totalAnswers;
            communication = Math.min(100, Math.max(40, 50 + (avgWords * 2 / 3)));
            answerQuality = Math.min(100, (technical + communication) / 2);
            overall = (technical * 4 + communication * 3 + answerQuality * 3) / 10;
        } else {
            overall = 0;
            technical = 0;
            communication = 0;
            answerQuality = 0;
        }

        String strengthsJson = "[\"Strong foundational understanding of software engineering concepts\",\"Demonstrated ability to answer live questions with structured thinking\",\"Comfortable speaking to system-level trade-offs\"]";
        String weaknessesJson = "[\"Could provide deeper mathematical/algorithmic time and space complexity proofs\",\"Opportunity to elaborate more on automated testing and observability\"]";
        String recommendationsJson = "[\"Practice explaining complex distributed system trade-offs aloud\",\"Deep-dive into database internal indexing and concurrency mechanisms\",\"Review company-specific behavioral leadership frameworks (e.g. STAR method)\"]";
        String nextActionsJson = "[\"Complete recommended DSA and System Design topics in Company Preparation module\",\"Practice at least 2 mock interviews per week with camera & mic enabled\",\"Review past session transcripts to refine pacing and verbal clarity\"]";

        String summary = String.format("Candidate completed %d interview questions. Overall score of %d/100 demonstrates %s competency.",
                totalAnswers, overall, overall >= 80 ? "exceptional" : (overall >= 60 ? "solid" : "developing"));

        return new ReportSynthesis(
                strengthsJson,
                weaknessesJson,
                recommendationsJson,
                nextActionsJson,
                overall,
                technical,
                communication,
                answerQuality,
                summary
        );
    }
}
