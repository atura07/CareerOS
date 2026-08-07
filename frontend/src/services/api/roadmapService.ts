import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'
import type { RoadmapDto } from './types'

/**
 * List all roadmaps for a user.
 * GET /api/v1/roadmaps?userId={userId}
 */
export async function listRoadmaps(
  userId: number = 1,
): Promise<RoadmapDto[]> {
  const response = await httpClient.get<RoadmapDto[]>(
    ENDPOINTS.ROADMAPS,
    { params: { userId } },
  )
  return response.data
}

/**
 * Get a single roadmap by ID.
 * GET /api/v1/roadmaps/{id}?userId={userId}
 */
export async function getRoadmap(
  id: number,
  userId: number = 1,
): Promise<RoadmapDto> {
  const response = await httpClient.get<RoadmapDto>(
    ENDPOINTS.ROADMAP_BY_ID(id),
    { params: { userId } },
  )
  return response.data
}

/**
 * Create a new roadmap.
 * POST /api/v1/roadmaps?userId={userId}
 */
export async function createRoadmap(
  payload: Partial<RoadmapDto>,
  userId: number = 1,
): Promise<RoadmapDto> {
  const response = await httpClient.post<RoadmapDto>(
    ENDPOINTS.ROADMAPS,
    payload,
    { params: { userId } },
  )
  return response.data
}

/**
 * Update an existing roadmap by ID.
 * PUT /api/v1/roadmaps/{id}?userId={userId}
 */
export async function updateRoadmap(
  id: number,
  payload: Partial<RoadmapDto>,
  userId: number = 1,
): Promise<RoadmapDto> {
  const response = await httpClient.put<RoadmapDto>(
    ENDPOINTS.ROADMAP_BY_ID(id),
    payload,
    { params: { userId } },
  )
  return response.data
}

/**
 * Delete a roadmap by ID.
 * DELETE /api/v1/roadmaps/{id}?userId={userId}
 */
export async function deleteRoadmap(
  id: number,
  userId: number = 1,
): Promise<void> {
  await httpClient.delete(ENDPOINTS.ROADMAP_BY_ID(id), {
    params: { userId },
  })
}
