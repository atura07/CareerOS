package com.careeros.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswerEntity, Long> {
    List<InterviewAnswerEntity> findBySessionId(Long sessionId);
    Optional<InterviewAnswerEntity> findByQuestionId(Long questionId);
}
