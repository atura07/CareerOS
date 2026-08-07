import { useCallback, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import {
  signIn,
  signOut,
  signUp,
  resetPassword,
  updatePassword,
  getSession,
  onAuthStateChange,
} from '../services/auth/authService'

export interface AuthUserView {
  id: string
  email: string
  fullName: string
}

export interface UseAuthReturn {
  user: AuthUserView | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
}

function toUserView(session: Session | null): AuthUserView | null {
  const user: User | undefined = session?.user
  if (!user) return null
  const meta = user.user_metadata as Record<string, unknown> | undefined
  return {
    id: user.id,
    email: user.email ?? '',
    fullName:
      typeof meta?.full_name === 'string' ? meta.full_name : (user.email ?? ''),
  }
}

/**
 * React hook wrapping the Supabase auth service.
 * Tracks the current user/session reactively via `onAuthStateChange`.
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      const { data } = await getSession()
      if (active) {
        setSession(data)
        setIsLoading(false)
      }
    }
    void bootstrap()

    const unsubscribe = onAuthStateChange((next) => {
      if (active) setSession(next)
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const { error } = await signIn({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const handleSignUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const { error } = await signUp({ email, password, fullName })
      return { error: error?.message ?? null }
    },
    [],
  )

  const handleSignOut = useCallback(async () => {
    const { error } = await signOut()
    return { error: error?.message ?? null }
  }, [])

  const handleResetPassword = useCallback(async (email: string) => {
    const { error } = await resetPassword(email)
    return { error: error?.message ?? null }
  }, [])

  const handleUpdatePassword = useCallback(async (newPassword: string) => {
    const { error } = await updatePassword(newPassword)
    return { error: error?.message ?? null }
  }, [])

  const user = toUserView(session)

  return {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
  }
}
