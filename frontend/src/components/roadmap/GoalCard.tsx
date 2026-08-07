import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

interface GoalCardProps {
  label: string
  value: string
  delay?: number
}

export function GoalCard({ label, value, delay = 0 }: GoalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-colors duration-300 hover:border-white/[0.12]"
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
          <Target className="h-3.5 w-3.5 text-blue-400" />
        </div>
        <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      </div>
      <p className="text-sm font-medium text-white/80">{value}</p>
    </motion.div>
  )
}
