package com.careeros.roadmap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<RoadmapEntity, Long> {

    List<RoadmapEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<RoadmapEntity> findByUserId(Long userId);
}
