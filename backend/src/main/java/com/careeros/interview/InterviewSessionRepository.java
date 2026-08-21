package com.careeros.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSessionEntity, Long> {

    List<InterviewSessionEntity> findByUserIdOrderByStartedAtDesc(Long userId);

    @Query("SELECT s FROM InterviewSessionEntity s LEFT JOIN FETCH s.questions q LEFT JOIN FETCH s.answers a WHERE s.id = :id AND s.userId = :userId")
    Optional<InterviewSessionEntity> findByIdAndUserIdWithDetails(Long id, Long userId);

    Optional<InterviewSessionEntity> findByIdAndUserId(Long id, Long userId);
}
