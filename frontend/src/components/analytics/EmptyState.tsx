import { motion } from 'framer-motion'
import { BarChart2, LayoutDashboard } from 'lucide-react'

export function AnalyticsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-16 backdrop-blur"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
        <BarChart2 className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">No analytics data yet</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-white/40">
        Your placement analytics will appear here once you start tracking applications, coding practice, and interviews.
      </p>
    </motion.div>
  )
}

export function PlacementEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-16 backdrop-blur"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
        <LayoutDashboard className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">
        No placement data yet
      </h3>
      <p className="mt-1 max-w-sm text-center text-sm text-white/40">
        Your placement readiness dashboard will populate as you complete
        modules across resume, DSA, GitHub, LeetCode, and interviews.
      </p>
    </motion.div>
  )
}
