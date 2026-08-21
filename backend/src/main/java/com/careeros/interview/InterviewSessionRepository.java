package com.careeros.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSessionEntity, Long> {

    List<InterviewSessionEntity> findByUserIdOrderByStartedAtDesc(Long userId);

    Optional<InterviewSessionEntity> findByIdAndUserId(Long id, Long userId);
}
