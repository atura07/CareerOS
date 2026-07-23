import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'
import type {
  RegisterRequest,
  AuthenticationRequest,
  AuthenticationResponse,
} from './types'

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

