import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function ReadinessScore({ data }: { data: AnalyticsData }) {
  const { overall, categories } = data.readiness

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <Target className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Placement Readiness</h3>
      </div>

      {/* Overall ring */}
      <div className="mb-5 flex items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#readinessGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 56}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - overall / 100) }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            <defs>
              <linearGradient id="readinessGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className="text-3xl font-bold text-white/90">{overall}</p>
            <p className="text-[10px] uppercase tracking-wide text-white/40">/ 100</p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-white/60">{cat.label}</span>
              <span className="font-semibold text-white/80">{cat.score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${cat.score}%` }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
