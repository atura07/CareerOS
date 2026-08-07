import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface ProgressTrackerProps {
  percent: number
  label?: string
}

export function ProgressTracker({ percent, label = 'Overall Completion' }: ProgressTrackerProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white/90">{label}</h3>
        </div>
        <span className="text-lg font-semibold text-emerald-400">{clamped}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
        />
      </div>
    </div>
  )
}
