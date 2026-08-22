import { httpClient } from './httpClient'
import type { AtsResponse, ATSAnalysisResponse } from './types'

export interface CategoryBreakdown {
  category: string
  score: number
  maxScore: number
  percentage: number
  feedback: string
}

export interface AtsDetailedResponse {
  analysisMode: 'OVERALL' | 'JOB_SPECIFIC' | 'UNIVERSAL'
  resumeId: number
  jobTitle?: string
  companyName?: string
  extractionStatus?: 'EXCELLENT' | 'GOOD' | 'OCR_USED' | 'PARTIAL' | 'FAILED'
  extractionMethod?: 'PDFBOX_DIRECT' | 'OCR_FALLBACK' | 'POI_DOCX' | 'HYBRID' | 'NONE'
  extractionConfidence?: number
  overallScore: number
  readinessLevel: string
  jobMatchScore?: number
  matchLevel?: string
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
  analyzedAt?: string
}

export interface AtsJobAnalysisRequest {
  jobTitle?: string
  companyName?: string
  jobDescription: string
}

// ════════ SaaS-Grade Resume Intelligence DTOs ════════

export interface CategoryDetail {
  category: string
  score: number
  maxScore: number
  weight: number
  status: 'STRONG' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL'
  reason: string
  evidence: string[]
  recommendations: string[]
}

export interface ActionableIssue {
  title: string
  impactLevel: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT'
  category: string
  fix: string
}

export interface DetailedRecommendation {
  title: string
  problem: string
  whyItMatters: string
  evidence: string
  suggestedImprovement: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  priority: 'P1' | 'P2' | 'P3'
}

export interface SuggestedKeywordItem {
  keyword: string
  category: string
  whyItMatters: string
}

export interface KeywordIntelligence {
  matched: string[]
  missing: string[]
  suggested: SuggestedKeywordItem[]
  keywordCoverage: number
}

export interface JobMatchDetails {
  requiredSkillsScore: number
  preferredSkillsScore: number
  experienceScore: number
  educationScore: number
  semanticScore: number
  matchedRequiredSkills: string[]
  missingRequiredSkills: string[]
  matchedPreferredSkills: string[]
  missingPreferredSkills: string[]
}

export interface HistoryComparison {
  previousOverallScore: number
  scoreDelta: number
  previousAnalyzedAt: string
  improvements: string[]
  regressions: string[]
  unchanged: string[]
}

export interface AtsIntelligenceResponse {
  analysisId: string
  resumeId: number
  mode: 'UNIVERSAL' | 'JOB_MATCH'
  targetRole: string
  analysisStatus: 'ANALYSIS_COMPLETE' | 'PARTIAL_ANALYSIS' | 'ANALYSIS_UNAVAILABLE'
  overallScore: number
  scoreLabel: string
  confidence: number
  confidenceMessage: string
  jobMatchScore?: number
  matchLevel?: string
  jobTitle?: string
  companyName?: string
  extraction: {
    status: string
    method: string
    confidence: number
    characterCount: number
    wordCount: number
    alphaRatio: number
  }
  summary: {
    headline: string
    description: string
  }
  scoreBreakdown: CategoryDetail[]
  strengths: string[]
  criticalIssues: ActionableIssue[]
  quickWins: string[]
  detailedRecommendations: DetailedRecommendation[]
  keywordAnalysis: KeywordIntelligence
  jobMatch?: JobMatchDetails
  historyComparison?: HistoryComparison
  analyzedAt: string
}

export interface BulletImprovementRequest {
  originalBullet: string
  targetRole?: string
  contextTech?: string
}

export interface BulletImprovementResponse {
  originalBullet: string
  improvedBullet: string
  alternativeVariations: string[]
  actionVerbUsed: string
  impactFormula: string
  metricsPlaceholderPrompts: string[]
  feedback: string
}

/**
 * Fetch SaaS-grade Universal ATS Intelligence analysis for a resume with role benchmarking.
 */
export async function getUniversalIntelligence(
  resumeId: number,
  targetRole: string = 'Software Engineer'
): Promise<AtsIntelligenceResponse> {
  const res = await httpClient.get<AtsIntelligenceResponse>(
    `/api/v1/ats/resumes/${resumeId}/intelligence`,
    { params: { targetRole } }
  )
  return res.data
}

/**
 * Analyze resume against a specific Job Description with SaaS Intelligence.
 */
export async function analyzeJobMatchIntelligence(
  resumeId: number,
  payload: AtsJobAnalysisRequest
): Promise<AtsIntelligenceResponse> {
  const res = await httpClient.post<AtsIntelligenceResponse>(
    `/api/v1/ats/resumes/${resumeId}/job-match`,
    payload
  )
  return res.data
}

/**
 * Interactive Bullet Point Improver.
 */
export async function improveBullet(
  payload: BulletImprovementRequest
): Promise<BulletImprovementResponse> {
  const res = await httpClient.post<BulletImprovementResponse>(
    '/api/v1/ats/bullet/improve',
    payload
  )
  return res.data
}

/**
 * Fetch real historical analysis timeline for a resume.
 */
export async function getResumeAnalysisHistory(
  resumeId: number
): Promise<AtsIntelligenceResponse[]> {
  const res = await httpClient.get<AtsIntelligenceResponse[]>(
    `/api/v1/ats/resumes/${resumeId}/history`
  )
  return res.data
}

/**
 * Backward-compatible Mode 1: Fetch overall ATS Readiness.
 */
export async function getOverallAts(resumeId: number): Promise<AtsDetailedResponse> {
  const res = await httpClient.get<AtsDetailedResponse>(
    `/api/v1/ats/resumes/${resumeId}/overall`
  )
  return res.data
}

/**
 * Backward-compatible Mode 2: Analyze match against JD.
 */
export async function analyzeJobMatch(
  resumeId: number,
  payload: AtsJobAnalysisRequest
): Promise<AtsDetailedResponse> {
  const res = await httpClient.post<AtsDetailedResponse>(
    `/api/v1/ats/resumes/${resumeId}/analyze-job`,
    payload
  )
  return res.data
}

/**
 * Legacy single-text ATS check.
 */
export async function analyzeText(text: string): Promise<AtsResponse> {
  const res = await httpClient.post<AtsResponse>('/api/v1/ats/analyze/text', { text })
  return res.data
}

/**
 * Legacy resume analysis by ID.
 */
export async function analyzeResumeById(resumeId: number, userId?: number): Promise<AtsResponse> {
  const res = await httpClient.get<AtsResponse>(`/api/v1/ats/analyze/${resumeId}`, {
    params: userId ? { userId } : undefined,
  })
  return res.data
}

/**
 * Legacy analyze resume against JD.
 */
export async function analyzeResumeAgainstJobDescription(
  resumeId: number,
  jobDescription: string
): Promise<ATSAnalysisResponse> {
  const res = await httpClient.post<ATSAnalysisResponse>('/api/v1/ats/api/ats/analyze', {
    resumeId,
    jobDescription,
  })
  return res.data
}
