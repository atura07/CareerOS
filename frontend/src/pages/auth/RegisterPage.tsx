import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/AuthContext'
import { registerUser, loginWithGoogle } from '../../services/api'

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0
      ? password === confirmPassword
      : null // null = not yet checked

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    try {
      const response = await registerUser({
        fullName: name,
        email,
        password,
      })
      navigate(`/verify-email?email=${encodeURIComponent(email)}&purpose=verify`, {
        state: { message: response.message || 'Verification code sent to your email.' },
      })
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.email ||
        err?.response?.data?.password ||
        err?.response?.data?.fullName ||
        'Registration failed. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your placement journey with CareerOS"
    >
      <div className="space-y-4">
        {/* Google One-Click Register */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full flex justify-center [&>div]:w-full [&>div]:flex [&>div]:justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in was cancelled or failed.')}
              theme="filled_black"
              shape="pill"
              text="signup_with"
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
            <span className="bg-[#05070c] px-3 text-white/40">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* Full Name */}
        <div>
          <label
            htmlFor="register-name"
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              autoComplete="name"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder-white/30 backdrop-blur transition-colors duration-200 hover:border-white/[0.14] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="register-email"
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder-white/30 backdrop-blur transition-colors duration-200 hover:border-white/[0.14] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="register-password"
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
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
          <p className="mt-1 text-xs text-white/30">
            At least 8 characters
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="register-confirm-password"
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm text-white/90 placeholder-white/30 backdrop-blur transition-colors duration-200 hover:border-white/[0.14] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

            {/* Password match indicator */}
            {passwordsMatch !== null && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 py-2.5 text-sm font-semibold text-white/90 ring-1 ring-blue-500/30 transition-all duration-200 hover:-translate-y-[1px] hover:bg-gradient-to-br hover:from-blue-500/40 hover:to-indigo-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {/* Login link */}
        <p className="text-center text-xs text-white/40 pt-2 border-t border-white/[0.04]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            Sign in
          </Link>
        </p>
        </form>
      </div>
    </AuthLayout>
  )
}


