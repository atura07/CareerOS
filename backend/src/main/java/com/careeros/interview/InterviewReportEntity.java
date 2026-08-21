package com.careeros.interview;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    @JsonIgnore
    private InterviewSessionEntity session;

    @Column(name = "overall_strengths", columnDefinition = "TEXT")
    private String overallStrengths; // JSON list

    @Column(name = "overall_weaknesses", columnDefinition = "TEXT")
    private String overallWeaknesses; // JSON list

    @Column(name = "questions_answered_well", columnDefinition = "TEXT")
    private String questionsAnsweredWell; // JSON list

    @Column(name = "questions_needing_improvement", columnDefinition = "TEXT")
    private String questionsNeedingImprovement; // JSON list

    @Column(name = "detailed_feedback", columnDefinition = "TEXT")
    private String detailedFeedback;

    @Column(columnDefinition = "TEXT")
    private String recommendations; // JSON list

    @Column(name = "next_preparation_actions", columnDefinition = "TEXT")
    private String nextPreparationActions; // JSON list

    @Column(name = "recommended_dsa_topics", columnDefinition = "TEXT")
    private String recommendedDsaTopics; // JSON list

    @Column(name = "interview_readiness", length = 50)
    private String interviewReadiness;

    @Column(name = "personalized_message", columnDefinition = "TEXT")
    private String personalizedMessage;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
