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

