import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthUser {
  email: string
  fullName: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (token: string, email: string, fullName: string) => void
  logout: () => void
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Restore session from localStorage on mount
    const token = localStorage.getItem(TOKEN_KEY)
    return token ? getStoredUser() : null
  })

  const login = useCallback((token: string, email: string, fullName: string) => {
    const userData: AuthUser = { email, fullName }
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
