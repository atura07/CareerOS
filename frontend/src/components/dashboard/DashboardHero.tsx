import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { GreetingData, ProfileCompletionData } from '../../services/api/dashboardService'

interface DashboardHeroProps {
  greeting?: GreetingData
  profile?: ProfileCompletionData
}

export function DashboardHero({ greeting, profile }: DashboardHeroProps) {
  const currentFormattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const timeGreeting = greeting?.timeGreeting || 'Welcome back'
  const userName = greeting?.name ? `, ${greeting.name}` : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-600/[0.08] via-white/[0.02] to-indigo-600/[0.08] p-6 backdrop-blur-xl sm:p-8"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col items-start justify-between gap-6 sm:gap-8 lg:flex-row lg:items-center">
        {/* Left greeting */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-medium text-white/50">{currentFormattedDate}</span>
            <span className="text-white/20">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400">
              <Sparkles className="h-3 w-3" /> CareerOS Student Workspace
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white/95 sm:text-3xl lg:text-4xl">
            {timeGreeting}
            {userName} 👋
          </h1>

          <p className="mt-2 max-w-xl text-xs sm:text-sm text-white/60 leading-relaxed">
            {greeting?.subtitle || "Let's build your placement profile step by step."}
          </p>

          {/* Quick Real Status Chips */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-xs text-white/50">Milestones:</span>
              <span className="text-xs sm:text-sm font-semibold text-white/90">
                {profile?.completedFieldsCount || 0} / {profile?.totalFieldsCount || 6} Completed
              </span>
            </div>

            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              Profile Settings <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right mini profile progress bar */}
        {profile && (
          <div className="w-full sm:w-auto shrink-0 rounded-2xl border border-white/[0.08] bg-black/30 p-4 sm:p-5 backdrop-blur min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white/80">Profile Readiness</span>
              <span className="font-bold text-blue-400">{profile.percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${profile.percentage}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-white/40">
              {profile.percentage < 50
                ? 'Complete remaining milestones to unlock insights.'
                : 'Great profile completeness! Keep practicing.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
