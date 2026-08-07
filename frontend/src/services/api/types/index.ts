// ─── Auth Types ────────────────────────────────────────────────────────────

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface AuthenticationRequest {
  email: string
  password: string
}

export interface AuthenticationResponse {
  token: string
  email: string
  fullName: string
}

// ─── Resume Types ──────────────────────────────────────────────────────────

export interface ResumeResponse {
  id: number
  userId: number
  originalFileName: string
  fileSize: number
  fileType: string
  uploadDate: string // ISO date-time
  extractedText: string
}

// ─── ATS Types ─────────────────────────────────────────────────────────────

export interface KeywordMatch {
  keyword: string
  found: boolean
  section: string
  frequency: number
}

export interface AtsSuggestion {
  section: string
  category: string
  message: string
  severity: 'high' | 'medium' | 'low'
}

export interface AtsResponse {
  resumeId: number | null
  overallScore: number
  keywordMatches: KeywordMatch[]
  detectedSections: string[]
  suggestions: AtsSuggestion[]
  summary: string | null
}

/**
 * Response from the JD-based ATS analysis endpoint (POST /api/ats/analyze).
 * Contains the ATS score, matched/missing keywords, and suggestions.
 */
export interface ATSAnalysisResponse {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}

export interface AnalyzeTextRequest {
  text: string
}

// ─── Application Types ─────────────────────────────────────────────────────

export interface ApplicationDto {
  id: number
  userId: number
  companyName: string
  companyLogo: string
  role: string
  packageValue: string
  location: string
  appliedDate: string
  lastUpdated: string
  status: string
  nextRound: string
  notes: string
  recruiter: string
  recruiterEmail: string
  applicationLink: string
  deadline: string
  priority: string
  createdAt?: string
  updatedAt?: string
}

// ─── Roadmap Types ─────────────────────────────────────────────────────────

export interface RoadmapDto {
  id: number
  userId: number
  company: string
  role: string
  duration: string
  totalWeeks: number
  focusAreas: string
  currentSkills: string
  weeklyPlans: string
  createdAt?: string
  updatedAt?: string
}

// ─── Error Types ───────────────────────────────────────────────────────────

export interface ApiError {
  error?: string
  [field: string]: string | undefined
}

