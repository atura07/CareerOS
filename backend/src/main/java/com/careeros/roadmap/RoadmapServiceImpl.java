package com.careeros.roadmap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of roadmap CRUD operations.
 */
@Service
@Transactional
public class RoadmapServiceImpl implements RoadmapService {

    private final RoadmapRepository roadmapRepository;

    public RoadmapServiceImpl(RoadmapRepository roadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoadmapResponse> getUserRoadmaps(Long userId) {
        return roadmapRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(RoadmapResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoadmapResponse getRoadmap(Long id, Long userId) {
        return RoadmapResponse.fromEntity(findOwned(id, userId));
    }

    @Override
    public RoadmapResponse createRoadmap(Long userId, RoadmapRequest request) {
        RoadmapEntity entity = new RoadmapEntity();
        entity.setUserId(userId);
        applyRequest(entity, request);
        RoadmapEntity saved = roadmapRepository.save(entity);
        return RoadmapResponse.fromEntity(saved);
    }

    @Override
    public RoadmapResponse updateRoadmap(Long id, Long userId, RoadmapRequest request) {
        RoadmapEntity entity = findOwned(id, userId);
        applyRequest(entity, request);
        RoadmapEntity saved = roadmapRepository.save(entity);
        return RoadmapResponse.fromEntity(saved);
    }

    @Override
    public void deleteRoadmap(Long id, Long userId) {
        RoadmapEntity entity = findOwned(id, userId);
        roadmapRepository.delete(entity);
    }

    private RoadmapEntity findOwned(Long id, Long userId) {
        RoadmapEntity entity = roadmapRepository.findById(id)
                .orElseThrow(() -> new RoadmapNotFoundException("Roadmap not found with id: " + id));
        if (!entity.getUserId().equals(userId)) {
            throw new RoadmapNotFoundException("Roadmap not found with id: " + id);
        }
        return entity;
    }

    private void applyRequest(RoadmapEntity entity, RoadmapRequest r) {
        entity.setCompany(r.getCompany());
        entity.setRole(r.getRole());
        entity.setDuration(r.getDuration());
        entity.setTotalWeeks(r.getTotalWeeks());
        entity.setFocusAreas(r.getFocusAreas());
        entity.setCurrentSkills(r.getCurrentSkills());
        entity.setWeeklyPlans(r.getWeeklyPlans());
    }
}
