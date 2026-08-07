import { motion } from 'framer-motion'
import { ProgressBar } from './ProgressBar'
import type { LeetCodeStats } from '../../data/leetcode'

export function DifficultyChart({ stats }: { stats: LeetCodeStats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <h3 className="mb-4 text-sm font-semibold tracking-tight text-white/90">
        Difficulty Distribution
      </h3>
      <div className="space-y-4">
        <ProgressBar
          label="Easy"
          value={stats.easy}
          max={stats.problemsSolved}
          color="bg-emerald-400"
          display={`${stats.easy} solved`}
        />
        <ProgressBar
          label="Medium"
          value={stats.medium}
          max={stats.problemsSolved}
          color="bg-amber-400"
          display={`${stats.medium} solved`}
        />
        <ProgressBar
          label="Hard"
          value={stats.hard}
          max={stats.problemsSolved}
          color="bg-rose-400"
          display={`${stats.hard} solved`}
        />
      </div>
      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-white/40">Total Solved</p>
        <p className="mt-0.5 text-xl font-semibold text-white/90">
          {stats.problemsSolved}
        </p>
      </div>
    </motion.div>
  )
}
