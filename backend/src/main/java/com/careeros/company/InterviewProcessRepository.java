package com.careeros.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewProcessRepository extends JpaRepository<InterviewProcessEntity, Long> {
    List<InterviewProcessEntity> findByCompanyIdOrderByRoundNumberAsc(Long companyId);
}
