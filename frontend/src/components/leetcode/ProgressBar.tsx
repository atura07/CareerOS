import { motion } from 'framer-motion'

interface ProgressBarProps {
  label: string
  value: number
  max: number
  color: string
  display?: string
}

export function ProgressBar({ label, value, max, color, display }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-white/60">{label}</span>
        <span className="font-semibold text-white/80">{display ?? value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}
