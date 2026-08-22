package com.careeros.ats.repository;

import com.careeros.ats.entity.AtsAnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AtsAnalysisRepository extends JpaRepository<AtsAnalysisEntity, Long> {

    List<AtsAnalysisEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<AtsAnalysisEntity> findByResumeIdOrderByCreatedAtDesc(Long resumeId);

    Optional<AtsAnalysisEntity> findFirstByResumeIdAndAnalysisModeOrderByCreatedAtDesc(Long resumeId, String analysisMode);

    List<AtsAnalysisEntity> findTop2ByResumeIdAndAnalysisModeOrderByCreatedAtDesc(Long resumeId, String analysisMode);

    Optional<AtsAnalysisEntity> findFirstByResumeIdAndAnalysisModeAndJobDescriptionHash(
            Long resumeId, String analysisMode, String jobDescriptionHash);
}
