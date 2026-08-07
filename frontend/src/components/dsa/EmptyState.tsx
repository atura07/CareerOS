import { motion } from 'framer-motion'
import { Binary } from 'lucide-react'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-16 backdrop-blur"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
        <Binary className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">No DSA progress yet</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-white/40">
        Start solving problems to unlock your tracker. Your progress, streaks, and achievements
        will appear here.
      </p>
    </motion.div>
  )
}
