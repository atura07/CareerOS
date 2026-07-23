/**
 * Backend API endpoints.
 * Base URL is configured in httpClient.ts (http://localhost:8080/api)
 */
export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/v1/auth/register',
  AUTH_AUTHENTICATE: '/v1/auth/authenticate',

  // Resume
  RESUME_UPLOAD: '/v1/resume/upload',
  RESUME_LIST: '/v1/resume',
  RESUME_BY_ID: (id: number) => `/v1/resume/${id}`,

  // ATS
  ATS_ANALYZE_BY_ID: (resumeId: number) => `/v1/ats/analyze/${resumeId}`,
  ATS_ANALYZE_TEXT: '/v1/ats/analyze/text',
} as const

