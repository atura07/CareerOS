import { httpClient } from './httpClient'

export type InterviewType = 'HR' | 'TECHNICAL' | 'SYSTEM_DESIGN' | 'DSA' | 'BEHAVIORAL' | 'MIXED'
export type InterviewDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface CreateSessionPayload {
  companyId?: number
  companyName?: string
  roleTitle?: string
  interviewType: InterviewType
  difficulty: InterviewDifficulty
  durationMinutes?: number
}

export interface SubmitAnswerPayload {
  transcript: string
  answerDurationSeconds?: number
}

export interface InterviewQuestion {
  id: number
  questionOrder: number
  questionText: string
  category: string
  expectedCriteria?: string
  isAdaptiveFollowUp: boolean
  isAnswered: boolean
  score?: number
  aiEvaluation?: string
}

export interface InterviewAnswer {
  id: number
  questionId: number
  transcript: string
  answerDurationSeconds?: number
  timestamp: string
  aiEvaluation?: string
  score?: number
  strengths?: string
  improvementAreas?: string
}

export interface InterviewReport {
  id: number
  sessionId: number
  overallStrengths?: string // JSON array
  overallWeaknesses?: string // JSON array
  recommendations?: string // JSON array
  nextPreparationActions?: string // JSON array
  createdAt: string
}

export interface InterviewSession {
  id: number
  userId: number
  companyId?: number
  companyName?: string
  companyLogo?: string
  roleTitle?: string
  interviewType: InterviewType
  difficulty: InterviewDifficulty
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'
  startedAt: string
  endedAt?: string
  durationMinutes: number
  overallScore?: number
  technicalScore?: number
  communicationScore?: number
  answerQualityScore?: number
  feedbackSummary?: string
  questions: InterviewQuestion[]
  report?: InterviewReport
}

export interface InterviewHistoryItem {
  id: number
  companyName: string
  companyLogo?: string
  roleTitle?: string
  interviewType: InterviewType
  difficulty: InterviewDifficulty
  startedAt: string
  durationMinutes: number
  overallScore?: number
  status: string
  result: string
}

export const createInterviewSession = async (
  payload: CreateSessionPayload
): Promise<InterviewSession> => {
  const res = await httpClient.post<InterviewSession>('/v1/interviews', payload)
  return res.data
}

export const getInterviewHistory = async (): Promise<InterviewHistoryItem[]> => {
  const res = await httpClient.get<InterviewHistoryItem[]>('/v1/interviews/history')
  return res.data
}

export const getInterviewSession = async (sessionId: number): Promise<InterviewSession> => {
  const res = await httpClient.get<InterviewSession>(`/v1/interviews/${sessionId}`)
  return res.data
}

export const getNextInterviewQuestion = async (
  sessionId: number
): Promise<InterviewQuestion | null> => {
  const res = await httpClient.get<InterviewQuestion | null>(`/v1/interviews/${sessionId}/questions/next`)
  return res.data
}

export const submitInterviewAnswer = async (
  sessionId: number,
  questionId: number,
  payload: SubmitAnswerPayload
): Promise<InterviewAnswer> => {
  const res = await httpClient.post<InterviewAnswer>(
    `/v1/interviews/${sessionId}/questions/${questionId}/answer`,
    payload
  )
  return res.data
}

export const completeInterviewSession = async (
  sessionId: number
): Promise<InterviewSession> => {
  const res = await httpClient.post<InterviewSession>(`/v1/interviews/${sessionId}/complete`)
  return res.data
}

export const getInterviewReport = async (sessionId: number): Promise<InterviewReport> => {
  const res = await httpClient.get<InterviewReport>(`/v1/interviews/${sessionId}/report`)
  return res.data
}
