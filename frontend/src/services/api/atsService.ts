import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'
import type { AtsResponse, AnalyzeTextRequest, ATSAnalysisResponse } from './types'

/**
 * Analyze a previously uploaded resume by its ID.
 * GET /api/v1/ats/analyze/{resumeId}?userId={userId}
 */
export async function analyzeResumeById(
  resumeId: number,
  userId: number = 1,
): Promise<AtsResponse> {
  const response = await httpClient.get<AtsResponse>(
    ENDPOINTS.ATS_ANALYZE_BY_ID(resumeId),
    { params: { userId } },
  )
  return response.data
}

/**
 * Analyze raw extracted text directly.
 * POST /api/v1/ats/analyze/text
 */
export async function analyzeText(
  data: AnalyzeTextRequest,
): Promise<AtsResponse> {
  const response = await httpClient.post<AtsResponse>(
    ENDPOINTS.ATS_ANALYZE_TEXT,
    data,
  )
  return response.data
}

/**
 * Analyze a resume against a job description.
 * POST /api/ats/analyze
 */
export async function analyzeResumeAgainstJobDescription(
  resumeId: number,
  jobDescription: string,
): Promise<ATSAnalysisResponse> {
  const response = await httpClient.post<ATSAnalysisResponse>(
    ENDPOINTS.ATS_ANALYZE_JD,
    { resumeId, jobDescription },
  )
  return response.data
}

