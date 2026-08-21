package com.careeros.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewReportRepository extends JpaRepository<InterviewReportEntity, Long> {
    Optional<InterviewReportEntity> findBySessionId(Long sessionId);
}
