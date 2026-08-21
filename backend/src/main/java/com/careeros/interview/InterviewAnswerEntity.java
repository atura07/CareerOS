package com.careeros.interview;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAnswerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnore
    private InterviewSessionEntity session;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private InterviewQuestionEntity question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String transcript;

    @Column(name = "answer_duration_seconds")
    private Integer answerDurationSeconds;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "ai_evaluation", columnDefinition = "TEXT")
    private String aiEvaluation;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "improvement_areas", columnDefinition = "TEXT")
    private String improvementAreas;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
