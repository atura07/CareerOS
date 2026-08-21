import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, Sparkles } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/AuthContext'
import { authenticateUser, loginWithGoogle, sendOtpUser } from '../../services/api'

export function LoginPage() {
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null)
    setSubmitting(true)
    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google')
      }
      const response = await loginWithGoogle({ idToken: credentialResponse.credential })
      if (response.token) {
        login(response.token, response.email, response.fullName || '')
        navigate('/dashboard', { replace: true })
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Google authentication failed. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Passwordless Email OTP Submit Handler
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !email.trim()) {
      setError('Please enter your email address')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      const response = await sendOtpUser({
        email: email.trim(),
        purpose: 'LOGIN',
      })
      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}&purpose=login`, {
        state: { message: response.message || 'Verification code sent to your email.' },
      })
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.email ||
        'Failed to send verification code. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Password Login Submit Handler
  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !email.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!password) {
      setError('Please enter your password')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      const response = await authenticateUser({ email: email.trim(), password })
      if (response.token) {
        login(response.token, response.email, response.fullName || '')
        navigate('/dashboard', { replace: true })
      }
    } catch (err: any) {
      if (err?.response?.data?.errorCode === 'EMAIL_NOT_VERIFIED') {
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, {
          state: { message: err.response.data.error || 'Please verify your email before logging in.' },
        })
        return
      }
      const message =
        err?.response?.data?.error ||
        'Invalid email or password'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome to CareerOS"
      subtitle="Sign in to your account and accelerate your career"
    >
      <div className="space-y-4">
        {/* Google One-Click Login */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full flex justify-center [&>div]:w-full [&>div]:flex [&>div]:justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in was cancelled or failed.')}
              theme="filled_black"
              shape="pill"
              text="continue_with"
              size="large"
              width="340"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#05070c] px-3 text-white/40">or continue with email</span>
          </div>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Mode: Passwordless Email OTP Login */}
        {authMode === 'otp' ? (
          <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-medium text-white/70"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder-white/30 backdrop-blur transition-colors duration-200 hover:border-white/[0.14] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 py-2.5 text-sm font-semibold text-white/90 ring-1 ring-blue-500/30 transition-all duration-200 hover:-translate-y-[1px] hover:bg-gradient-to-br hover:from-blue-500/40 hover:to-indigo-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
                  Sending code...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  Send verification code
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Toggle to Password Login */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password')
                  setError(null)
                }}
                className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                <KeyRound className="h-3.5 w-3.5 text-white/40" />
                Sign in with password instead
              </button>
            </div>
          </form>
        ) : (
          /* Mode: Standard Password Login */
          <form onSubmit={handlePasswordLogin} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-email-pwd"
                className="mb-1.5 block text-xs font-medium text-white/70"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="login-email-pwd"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder-white/30 backdrop-blur transition-colors duration-200 hover:border-white/[0.14] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-xs font-medium text-white/70"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(null)
                  }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm text-white/90 placeholder-white/30 backdrop-blur transition-colors duration-200 hover:border-white/[0.14] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !email.trim() || !password}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 py-2.5 text-sm font-semibold text-white/90 ring-1 ring-blue-500/30 transition-all duration-200 hover:-translate-y-[1px] hover:bg-gradient-to-br hover:from-blue-500/40 hover:to-indigo-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Toggle back to OTP */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp')
                  setError(null)
                }}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                Sign in with email code instead
              </button>
            </div>
          </form>
        )}

        {/* Register link */}
        <p className="text-center text-xs text-white/40 pt-2 border-t border-white/[0.04]">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}


