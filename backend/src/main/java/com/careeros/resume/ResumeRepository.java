package com.careeros.resume;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeEntity, Long> {

    List<ResumeEntity> findByUserIdOrderByUploadDateDesc(Long userId);

    List<ResumeEntity> findByUserId(Long userId);
}

