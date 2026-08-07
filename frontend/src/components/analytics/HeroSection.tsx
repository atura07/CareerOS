import { motion } from 'framer-motion'
import { Flame, Target } from 'lucide-react'
import { ProgressRing } from './ProgressRing'
import type { PlacementScoreData } from '../../data/analytics'

interface HeroSectionProps {
  data: PlacementScoreData
  userName?: string
}

export function HeroSection({ data, userName }: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-blue-500/[0.08] via-white/[0.03] to-indigo-500/[0.08] p-6 backdrop-blur sm:p-8"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left: greeting + metrics */}
        <div className="flex-1">
          <p className="text-sm text-white/40">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl">
            Welcome back
            {userName ? `, ${userName}` : ''} 👋
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/50">
            Here&apos;s your placement readiness overview. Keep up the momentum
            toward your target role.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-white/50">Streak</span>
              <span className="text-sm font-semibold text-white/90">
                {data.streak} days
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-white/50">Target</span>
              <span className="text-sm font-semibold text-white/90">
                {data.targetCompany}
              </span>
            </div>
          </div>
        </div>

        {/* Right: readiness ring */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-white/90">
              Placement Readiness
            </p>
            <p className="mt-1 text-xs text-white/40">
              Overall score {data.overall}/100
            </p>
          </div>
          <ProgressRing
            value={data.readiness}
            size={132}
            stroke={11}
            label={`${data.readiness}%`}
            sublabel="Ready"
            gradientId="heroPlacementGradient"
            colorFrom="#60a5fa"
            colorTo="#a78bfa"
          />
        </div>
      </div>
    </motion.div>
  )
}
