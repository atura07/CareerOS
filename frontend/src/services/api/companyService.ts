import { httpClient } from './httpClient'

export interface CompanyRole {
  id: number
  title: string
  location?: string
  experienceLevel?: string
  eligibilityInfo?: string
  requiredSkills: string[]
  active: boolean
}

export interface InterviewProcess {
  id: number
  roundNumber: number
  roundName: string
  roundType: string
  description?: string
  preparationRequirements?: string
}

export interface CompanyPrepTopic {
  id: number
  roleId?: number
  subject: string
  topic: string
  priority: string
  estimatedEffort?: string
  resourcesJson?: string
}

export interface CompanySummary {
  id: number
  name: string
  slug: string
  logoUrl?: string
  website?: string
  description?: string
  industry?: string
  packageInfo?: string
  location?: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  active: boolean
  processSummary: string[]
  rolesCount: number
  prepTopicsCount: number
}

export interface CompanyDetail extends CompanySummary {
  roles: CompanyRole[]
  interviewProcesses: InterviewProcess[]
  prepTopics: CompanyPrepTopic[]
}

export interface UserPrepTask {
  id: number
  topicId: number
  subject: string
  topic: string
  priority: string
  estimatedEffort: string
  status: 'PENDING' | 'COMPLETED'
  completedDate?: string
  notes?: string
}

export interface UserCompanyPrep {
  id: number
  userId: number
  companyId: number
  companyName: string
  companySlug: string
  roleId?: number
  roleTitle?: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  startedDate?: string
  targetDate?: string
  progressPercentage: number
  completedTasksCount: number
  totalTasksCount: number
  tasks: UserPrepTask[]
}

export interface StartPrepPayload {
  roleId?: number
  targetDate?: string
}

export const getCompanies = async (): Promise<CompanySummary[]> => {
  const res = await httpClient.get<CompanySummary[]>('/v1/companies')
  return res.data
}

export const getCompanyBySlug = async (slug: string): Promise<CompanyDetail> => {
  const res = await httpClient.get<CompanyDetail>(`/v1/companies/${slug}`)
  return res.data
}

export const getUserCompanyPrep = async (slug: string): Promise<UserCompanyPrep | null> => {
  const res = await httpClient.get<UserCompanyPrep | null>(`/v1/companies/${slug}/preparation`)
  return res.data
}

export const startCompanyPrep = async (
  slug: string,
  payload?: StartPrepPayload
): Promise<UserCompanyPrep> => {
  const res = await httpClient.post<UserCompanyPrep>(`/v1/companies/${slug}/preparation/start`, payload || {})
  return res.data
}

export const toggleCompanyPrepTask = async (
  slug: string,
  topicId: number,
  status?: string
): Promise<UserCompanyPrep> => {
  const res = await httpClient.post<UserCompanyPrep>(
    `/v1/companies/${slug}/preparation/tasks/${topicId}/toggle`,
    null,
    { params: { status } }
  )
  return res.data
}
