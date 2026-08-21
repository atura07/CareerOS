package com.careeros.interview;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnore
    private InterviewSessionEntity session;

    @Column(name = "question_order", nullable = false)
    private Integer questionOrder;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "expected_criteria", columnDefinition = "TEXT")
    private String expectedCriteria;

    @Column(name = "is_adaptive_follow_up")
    @Builder.Default
    private Boolean isAdaptiveFollowUp = false;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL)
    private InterviewAnswerEntity answer;
}
