/**
 * Backend API endpoints.
 * Base URL is configured in httpClient.ts via VITE_API_URL (e.g. https://careeros-en8x.onrender.com/api)
 */
export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/v1/auth/register',
  AUTH_AUTHENTICATE: '/v1/auth/authenticate',
  AUTH_GOOGLE: '/v1/auth/google',
  AUTH_SEND_OTP: '/v1/auth/otp/send',
  AUTH_VERIFY_OTP: '/v1/auth/verify-otp',
  AUTH_RESEND_OTP: '/v1/auth/resend-otp',



  // Resume
  RESUME_UPLOAD: '/v1/resume/upload',
  RESUME_LIST: '/v1/resume',
  RESUME_BY_ID: (id: number) => `/v1/resume/${id}`,

  // ATS
  ATS_OVERALL: (resumeId: number) => `/v1/ats/resumes/${resumeId}/overall`,
  ATS_ANALYZE_JOB: (resumeId: number) => `/v1/ats/resumes/${resumeId}/analyze-job`,
  ATS_ANALYZE_BY_ID: (resumeId: number) => `/v1/ats/analyze/${resumeId}`,
  ATS_ANALYZE_TEXT: '/v1/ats/analyze/text',
  ATS_ANALYZE_JD: '/v1/ats/api/ats/analyze',

  // Applications
  APPLICATIONS: '/v1/applications',
  APPLICATION_BY_ID: (id: number) => `/v1/applications/${id}`,

  // Roadmaps
  ROADMAPS: '/v1/roadmaps',
  ROADMAP_BY_ID: (id: number) => `/v1/roadmaps/${id}`,

  // Dashboard
  DASHBOARD_SUMMARY: '/v1/dashboard/summary',

  // LeetCode
  LEETCODE_ME: '/v1/leetcode/me',
  LEETCODE_STATUS: '/v1/leetcode/status',
  LEETCODE_PREVIEW: '/v1/leetcode/preview',
  LEETCODE_CONNECT: '/v1/leetcode/connect',
  LEETCODE_DISCONNECT: '/v1/leetcode/disconnect',
  LEETCODE_SYNC: '/v1/leetcode/sync',
  LEETCODE_PUBLIC: (username: string) => `/v1/leetcode/public/${encodeURIComponent(username)}`,
  LEETCODE: (username?: string) => (username ? `/v1/leetcode/public/${encodeURIComponent(username)}` : '/v1/leetcode/me'),
} as const

