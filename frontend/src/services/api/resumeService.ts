import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'
import type { ResumeResponse } from './types'

/**
 * Upload a resume file.
 * POST /api/v1/resume/upload
 */
export async function uploadResume(
  file: File,
  userId: number = 1,
): Promise<ResumeResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', String(userId))

  const response = await httpClient.post<ResumeResponse>(
    ENDPOINTS.RESUME_UPLOAD,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return response.data
}

/**
 * List all resumes for a user.
 * GET /api/v1/resume?userId={userId}
 */
export async function listResumes(
  userId: number = 1,
): Promise<ResumeResponse[]> {
  const response = await httpClient.get<ResumeResponse[]>(
    ENDPOINTS.RESUME_LIST,
    { params: { userId } },
  )
  return response.data
}

/**
 * Get a single resume by ID.
 * GET /api/v1/resume/{id}?userId={userId}
 */
export async function getResume(
  id: number,
  userId: number = 1,
): Promise<ResumeResponse> {
  const response = await httpClient.get<ResumeResponse>(
    ENDPOINTS.RESUME_BY_ID(id),
    { params: { userId } },
  )
  return response.data
}

/**
 * Delete a resume by ID.
 * DELETE /api/v1/resume/{id}?userId={userId}
 */
export async function deleteResume(
  id: number,
  userId: number = 1,
): Promise<void> {
  await httpClient.delete(ENDPOINTS.RESUME_BY_ID(id), {
    params: { userId },
  })
}

