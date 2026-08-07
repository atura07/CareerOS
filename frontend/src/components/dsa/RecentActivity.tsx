import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import type { RecentSolve } from '../../data/dsa'

interface RecentActivityProps {
  items: RecentSolve[]
}

const DIFF_STYLES: Record<RecentSolve['difficulty'], string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90">
        <Activity className="h-4 w-4 text-blue-400" /> Recent Activity
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-white/80">{item.title}</p>
              <p className="text-xs text-white/40">
                {item.topic} ·<span className={`ml-1 ${DIFF_STYLES[item.difficulty]}`}>{item.difficulty}</span>
              </p>
            </div>
            <span className="shrink-0 text-xs text-white/40">{item.date}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
