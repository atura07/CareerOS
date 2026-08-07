import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import type { ContestEntry } from '../../data/leetcode'

export function ContestCard({ contests }: { contests: ContestEntry[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
          <Trophy className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight text-white/90">Contest History</h3>
      </div>
      <div className="space-y-3">
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-white/80">{contest.name}</p>
              <p className="text-[10px] uppercase tracking-wide text-white/40">{contest.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                  <TrendingUp className="h-3.5 w-3.5" /> {contest.rating}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-white/40">Rank {contest.rank}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
