import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'
import type { AtsResponse, AnalyzeTextRequest, ATSAnalysisResponse } from './types'

export interface CategoryBreakdown {
  category: string
  score: number
  maxScore: number
  percentage: number
  feedback: string
}

export interface AtsDetailedResponse {
  analysisMode: 'OVERALL' | 'JOB_SPECIFIC'
  resumeId: number
  jobTitle?: string
  companyName?: string
  overallScore: number
  readinessLevel: string
  jobMatchScore?: number | null
  matchLevel?: string | null
  summary: string
  breakdown: CategoryBreakdown[]
  matchedSkills: string[]
  missingSkills: string[]
  additionalResumeSkills: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  keywordMatchPercentage: number
  strengths: string[]
  improvements: string[]
  warnings: string[]
  analyzedAt: string
}

export interface AtsJobAnalysisRequest {
  jobTitle?: string
  companyName?: string
  jobDescription: string
}

/**
 * MODE 1: Get deterministic Overall ATS Readiness for a resume.
 * GET /api/v1/ats/resumes/{resumeId}/overall
 */
export async function getOverallAts(resumeId: number): Promise<AtsDetailedResponse> {
  const response = await httpClient.get<AtsDetailedResponse>(ENDPOINTS.ATS_OVERALL(resumeId))
  return response.data
}

/**
 * MODE 2: Analyze resume match against a specific Job Description.
 * POST /api/v1/ats/resumes/{resumeId}/analyze-job
 */
export async function analyzeJobMatch(
  resumeId: number,
  request: AtsJobAnalysisRequest,
): Promise<AtsDetailedResponse> {
  const response = await httpClient.post<AtsDetailedResponse>(
    ENDPOINTS.ATS_ANALYZE_JOB(resumeId),
    request,
  )
  return response.data
}

/**
 * Legacy: Analyze a previously uploaded resume by its ID.
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
 * Legacy: Analyze raw extracted text directly.
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
 * Legacy: Analyze a resume against a job description.
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
