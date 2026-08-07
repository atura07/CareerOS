import { supabase } from '../../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

/**
 * Supabase Auth service.
 *
 * All authentication flows go through Supabase Auth. Session persistence is
 * handled automatically by the Supabase client (localStorage).
 */

export interface SignUpParams {
  email: string
  password: string
  fullName?: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface AuthResult<T> {
  data: T | null
  error: { message: string } | null
}

/** Extract a human-friendly message from a Supabase auth error. */
function messageOf(error: unknown): { message: string } {
  if (error && typeof error === 'object' && 'message' in error) {
    return { message: String((error as { message: unknown }).message) }
  }
  return { message: 'An unexpected error occurred.' }
}

/** Register a new user with email + password. */
export async function signUp({
  email,
  password,
  fullName,
}: SignUpParams): Promise<AuthResult<Session>> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: fullName ? { data: { full_name: fullName } } : undefined,
  })
  return { data: data.session, error: error ? messageOf(error) : null }
}

/** Sign in with email + password. */
export async function signIn({
  email,
  password,
}: SignInParams): Promise<AuthResult<Session>> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data: data.session, error: error ? messageOf(error) : null }
}

/** Sign out the current user. */
export async function signOut(): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.signOut()
  return { data: null, error: error ? messageOf(error) : null }
}

/** Send a password reset email. */
export async function resetPassword(
  email: string,
): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  return { data: null, error: error ? messageOf(error) : null }
}

/** Update the current user's password (after a reset link). */
export async function updatePassword(
  newPassword: string,
): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { data: null, error: error ? messageOf(error) : null }
}

/** Get the current session. */
export async function getSession(): Promise<AuthResult<Session>> {
  const { data, error } = await supabase.auth.getSession()
  return { data: data.session, error: error ? messageOf(error) : null }
}

/** Get the current user. */
export async function getCurrentUser(): Promise<AuthResult<User>> {
  const { data, error } = await supabase.auth.getUser()
  return { data: data.user, error: error ? messageOf(error) : null }
}

/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function onAuthStateChange(
  callback: (session: Session | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return () => data.subscription.unsubscribe()
}
