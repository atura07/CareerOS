export { httpClient } from './httpClient'
export { ENDPOINTS } from './endpoints'
export {
  registerUser,
  authenticateUser,
  loginWithGoogle,
  sendOtpUser,
  verifyOtpUser,
  resendOtpUser,
} from './authService'
export { uploadResume, listResumes, getResume, deleteResume } from './resumeService'
export {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from './applicationService'
export {
  listRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from './roadmapService'
export {
  analyzeResumeById,
  analyzeText,
  analyzeResumeAgainstJobDescription,
  getOverallAts,
  analyzeJobMatch,
  getUniversalIntelligence,
  analyzeJobMatchIntelligence,
  improveBullet,
  getResumeAnalysisHistory,
} from './atsService'
export type {
  AtsDetailedResponse,
  CategoryBreakdown,
  AtsJobAnalysisRequest,
  AtsIntelligenceResponse,
  CategoryDetail,
  ActionableIssue,
  DetailedRecommendation,
  SuggestedKeywordItem,
  KeywordIntelligence,
  JobMatchDetails,
  HistoryComparison,
  BulletImprovementRequest,
  BulletImprovementResponse,
} from './atsService'
export {
  getCompanies,
  getCompanyBySlug,
  getUserCompanyPrep,
  startCompanyPrep,
  toggleCompanyPrepTask,
} from './companyService'
export type {
  CompanySummary,
  CompanyDetail,
  CompanyRole,
  InterviewProcess,
  CompanyPrepTopic,
  UserCompanyPrep,
  UserPrepTask,
  StartPrepPayload,
} from './companyService'
export {
  createInterviewSession,
  getInterviewHistory,
  getInterviewSession,
  getNextInterviewQuestion,
  submitInterviewAnswer,
  completeInterviewSession,
  getInterviewReport,
} from './interviewService'
export type {
  InterviewType,
  InterviewDifficulty,
  InterviewStage,
  CreateSessionPayload,
  SubmitAnswerPayload,
  InterviewQuestion,
  InterviewAnswer,
  CandidateEvaluation,
  InterviewState,
  SubmitAnswerResponse,
  InterviewReport,
  InterviewSession,
  InterviewHistoryItem,
} from './interviewService'
export type {
  RegisterRequest,
  AuthenticationRequest,
  GoogleAuthRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  AuthenticationResponse,
  ResumeResponse,
  KeywordMatch,
  AtsSuggestion,
  AtsResponse,
  ATSAnalysisResponse,
  ApplicationDto,
  RoadmapDto,
  ApiError,
} from './types'

export { dashboardService } from './dashboardService'
export type {
  DashboardSummaryResponse,
  PlacementReadinessData,
  JourneyStatusData,
  JourneyCardStatus,
  NextActionData,
  RecentActivityData,
  ProfileCompletionData,
  ConsistencyData,
} from './dashboardService'
