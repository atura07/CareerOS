import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'
import type {
  RegisterRequest,
  AuthenticationRequest,
  AuthenticationResponse,
  GoogleAuthRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
} from './types'

/**
 * Login or register via Google OAuth2 ID Token.
 * POST /api/v1/auth/google
 */
export async function loginWithGoogle(
  data: GoogleAuthRequest,
): Promise<AuthenticationResponse> {
  const response = await httpClient.post<AuthenticationResponse>(
    ENDPOINTS.AUTH_GOOGLE,
    data,
  )
  return response.data
}

/**
 * Send 6-digit OTP for passwordless login or verification.
 * POST /api/v1/auth/otp/send
 */
export async function sendOtpUser(
  data: SendOtpRequest,
): Promise<AuthenticationResponse> {
  const response = await httpClient.post<AuthenticationResponse>(
    ENDPOINTS.AUTH_SEND_OTP,
    data,
  )
  return response.data
}

/**
 * Register a new user account.
 * POST /api/v1/auth/register
 */
export async function registerUser(
  data: RegisterRequest,
): Promise<AuthenticationResponse> {
  const response = await httpClient.post<AuthenticationResponse>(
    ENDPOINTS.AUTH_REGISTER,
    data,
  )
  return response.data
}

/**
 * Authenticate (login) with email and password.
 * POST /api/v1/auth/authenticate
 */
export async function authenticateUser(
  data: AuthenticationRequest,
): Promise<AuthenticationResponse> {
  const response = await httpClient.post<AuthenticationResponse>(
    ENDPOINTS.AUTH_AUTHENTICATE,
    data,
  )
  return response.data
}

/**
 * Verify 6-digit email OTP.
 * POST /api/v1/auth/verify-otp
 */
export async function verifyOtpUser(
  data: VerifyOtpRequest,
): Promise<AuthenticationResponse> {
  const response = await httpClient.post<AuthenticationResponse>(
    ENDPOINTS.AUTH_VERIFY_OTP,
    data,
  )
  return response.data
}

/**
 * Resend 6-digit email OTP.
 * POST /api/v1/auth/resend-otp
 */
export async function resendOtpUser(
  data: ResendOtpRequest,
): Promise<AuthenticationResponse> {
  const response = await httpClient.post<AuthenticationResponse>(
    ENDPOINTS.AUTH_RESEND_OTP,
    data,
  )
  return response.data
}



