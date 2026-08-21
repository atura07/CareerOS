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
export { analyzeResumeById, analyzeText, analyzeResumeAgainstJobDescription } from './atsService'
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
  CreateSessionPayload,
  SubmitAnswerPayload,
  InterviewQuestion,
  InterviewAnswer,
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
  AnalyzeTextRequest,
  ApplicationDto,
  RoadmapDto,
  ApiError,
} from './types'


