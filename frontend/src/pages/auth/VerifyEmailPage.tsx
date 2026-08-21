import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Mail, CheckCircle2, ArrowRight, RotateCw, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { verifyOtpUser, resendOtpUser } from '../../services/api'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  // Get email and purpose from query parameter or router state
  const initialEmail = searchParams.get('email') || (location.state?.email as string) || ''
  const initialMessage = (location.state?.message as string) || ''
  const purpose = searchParams.get('purpose') || (location.state?.purpose as string) || 'verify'
  const isLoginFlow = purpose === 'login'

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(initialMessage || null)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)


  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // Focus first input on mount if email exists
  useEffect(() => {
    if (email && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [email])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numeric digit
    const cleaned = value.replace(/\D/g, '').slice(-1)

    const updated = [...otp]
    updated[index] = cleaned
    setOtp(updated)
    setError(null)

    // Move to next input if digit entered
    if (cleaned && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move back and clear previous
        const updated = [...otp]
        updated[index - 1] = ''
        setOtp(updated)
        inputRefs.current[index - 1]?.focus()
      } else {
        const updated = [...otp]
        updated[index] = ''
        setOtp(updated)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pastedData) return

    const updated = [...otp]
    for (let i = 0; i < 6; i++) {
      updated[i] = pastedData[i] || ''
    }
    setOtp(updated)
    setError(null)

    // Focus last filled or next empty input
    const nextIdx = Math.min(pastedData.length, 5)
    inputRefs.current[nextIdx]?.focus()
  }

  const handleVerify = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    const otpCode = otp.join('').trim()

    if (!email || !email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.')
      return
    }

    setError(null)
    setInfoMessage(null)
    setVerifying(true)

    try {
      const response = await verifyOtpUser({
        email: email.trim(),
        otp: otpCode,
      })

      if (response.token) {
        login(response.token, response.email, response.fullName || '')
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', {
          replace: true,
          state: { message: 'Email verified successfully. Please sign in.' },
        })
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.otp ||
        'Verification failed. The code may be invalid or expired.'
      setError(message)
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email || !email.trim()) {
      setError('Please provide your email address to resend code.')
      return
    }

    if (countdown > 0 || resending) return

    setError(null)
    setInfoMessage(null)
    setResending(true)

    try {
      const response = await resendOtpUser({ email: email.trim() })
      setInfoMessage(response.message || 'A new 6-digit code has been sent to your email.')
      setCountdown(60) // Restart cooldown timer on success
      setOtp(['', '', '', '', '', '']) // Clear previous digits
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        'Failed to resend code. Please wait a moment and try again.'
      setError(message)
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      title={isLoginFlow ? "Sign in with code" : "Verify your email"}
      subtitle={isLoginFlow ? "Enter the 6-digit code sent to your email to continue" : "Enter the 6-digit security code sent to your inbox"}
    >

      <form onSubmit={handleVerify} className="space-y-5" noValidate>
        {/* Email Address Display / Input */}
        <div>
          <label
            htmlFor="verify-email"
            className="mb-1.5 block text-xs font-medium text-white/60"
          >
            Verification email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="verify-email"
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

        {/* Info / Success message */}
        {infoMessage && (
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
            <span className="leading-relaxed">{infoMessage}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* 6-Digit OTP Segmented Inputs */}
        <div>
          <label className="mb-2 block text-center text-xs font-medium text-white/60">
            6-Digit Verification Code
          </label>
          <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={verifying}
                aria-label={`Digit ${idx + 1}`}
                className="h-12 w-11 sm:w-12 rounded-xl border border-white/[0.1] bg-white/[0.05] text-center text-xl font-bold tracking-wider text-white shadow-inner transition-all duration-200 hover:border-white/[0.2] focus:border-blue-400 focus:bg-blue-500/[0.06] focus:outline-none focus:ring-2 focus:ring-blue-400/30 disabled:opacity-50"
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-white/40">
            Code expires in <span className="text-white/60 font-medium">10 minutes</span>
          </p>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={verifying || otp.join('').length !== 6}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 py-2.5 text-sm font-semibold text-white/90 ring-1 ring-blue-500/30 transition-all duration-200 hover:-translate-y-[1px] hover:bg-gradient-to-br hover:from-blue-500/40 hover:to-indigo-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {verifying ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
              Verifying code...
            </>
          ) : (
            <>
              {isLoginFlow ? 'Continue to Dashboard' : 'Verify Email'}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}

        </button>

        {/* Resend Actions & Cooldown Timer */}
        <div className="flex flex-col items-center justify-center gap-2 pt-2 text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <span>Didn&apos;t receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className="inline-flex items-center gap-1 font-medium text-blue-400 transition-colors hover:text-blue-300 disabled:text-white/30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              {resending ? (
                <>
                  <RotateCw className="h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                <span>Resend in {countdown}s</span>
              ) : (
                <span>Resend code</span>
              )}
            </button>
          </div>

          {/* Return link */}
          <p className="mt-2 text-center text-xs text-white/30">
            Back to{' '}
            <Link
              to="/login"
              className="font-medium text-white/50 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              Sign in
            </Link>
            {' '}&bull;{' '}
            <Link
              to="/register"
              className="font-medium text-white/50 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              Create new account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
