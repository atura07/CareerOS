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

export interface AnalyzeTextRequest {
  text: string
}

// ─── Error Types ───────────────────────────────────────────────────────────

export interface ApiError {
  error?: string
  [field: string]: string | undefined
}

