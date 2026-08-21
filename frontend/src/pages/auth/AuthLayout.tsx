import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CareerOSLogo } from '../../components/common/CareerOSLogo'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05070c] px-4 text-white">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.15),rgba(99,102,241,0.06),transparent)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      {/* Brand / Logo */}
      <Link
        to="/"
        className="group mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
        aria-label="CareerOS Home"
      >
        <CareerOSLogo size={32} className="shrink-0 drop-shadow-md" />
        <span className="text-lg font-semibold tracking-tight text-white/90">
          CareerOS
        </span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-white/50">{subtitle}</p>
        </div>

        {/* Form content */}
        {children}
      </div>
    </div>
  )
}

