package com.careeros.roadmap;

import java.util.List;

/**
 * Service contract for roadmap CRUD operations.
 */
public interface RoadmapService {

    List<RoadmapResponse> getUserRoadmaps(Long userId);

    RoadmapResponse getRoadmap(Long id, Long userId);

    RoadmapResponse createRoadmap(Long userId, RoadmapRequest request);

    RoadmapResponse updateRoadmap(Long id, Long userId, RoadmapRequest request);

    void deleteRoadmap(Long id, Long userId);
}
