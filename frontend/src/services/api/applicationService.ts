import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'
import type { ApplicationDto } from './types'

/**
 * List all applications for a user.
 * GET /api/v1/applications?userId={userId}
 */
export async function listApplications(
  userId: number = 1,
): Promise<ApplicationDto[]> {
  const response = await httpClient.get<ApplicationDto[]>(
    ENDPOINTS.APPLICATIONS,
    { params: { userId } },
  )
  return response.data
}

/**
 * Get a single application by ID.
 * GET /api/v1/applications/{id}?userId={userId}
 */
export async function getApplication(
  id: number,
  userId: number = 1,
): Promise<ApplicationDto> {
  const response = await httpClient.get<ApplicationDto>(
    ENDPOINTS.APPLICATION_BY_ID(id),
    { params: { userId } },
  )
  return response.data
}

/**
 * Create a new application.
 * POST /api/v1/applications?userId={userId}
 */
export async function createApplication(
  payload: Partial<ApplicationDto>,
  userId: number = 1,
): Promise<ApplicationDto> {
  const response = await httpClient.post<ApplicationDto>(
    ENDPOINTS.APPLICATIONS,
    payload,
    { params: { userId } },
  )
  return response.data
}

/**
 * Update an existing application by ID.
 * PUT /api/v1/applications/{id}?userId={userId}
 */
export async function updateApplication(
  id: number,
  payload: Partial<ApplicationDto>,
  userId: number = 1,
): Promise<ApplicationDto> {
  const response = await httpClient.put<ApplicationDto>(
    ENDPOINTS.APPLICATION_BY_ID(id),
    payload,
    { params: { userId } },
  )
  return response.data
}

/**
 * Delete an application by ID.
 * DELETE /api/v1/applications/{id}?userId={userId}
 */
export async function deleteApplication(
  id: number,
  userId: number = 1,
): Promise<void> {
  await httpClient.delete(ENDPOINTS.APPLICATION_BY_ID(id), {
    params: { userId },
  })
}
