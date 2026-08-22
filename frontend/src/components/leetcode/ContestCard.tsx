import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Sparkles } from 'lucide-react'
import type { ContestEntry } from '../../types/leetcode'

export function ContestCard({ contests }: { contests?: ContestEntry[] | null }) {
  const hasContests = Boolean(contests && contests.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-500/20">
              <Trophy className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-white/90">Contest History</h3>
          </div>
          {hasContests && (
            <span className="text-[11px] font-medium text-white/40">
              {contests?.length} {contests?.length === 1 ? 'Contest' : 'Contests'}
            </span>
          )}
        </div>

        {hasContests ? (
          <div className="space-y-2.5">
            {contests?.map((contest) => (
              <div
                key={contest.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 transition hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs font-medium text-white/85">{contest.name}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/40">{contest.date}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="flex items-center justify-end gap-1 text-xs font-semibold text-amber-400">
                    <TrendingUp className="h-3.5 w-3.5" /> {contest.rating}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-white/40">Rank #{contest.rank.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/40 ring-1 ring-white/[0.08]">
              <Sparkles className="h-5 w-5 text-amber-400/70" />
            </div>
            <h4 className="text-xs font-semibold text-white/85">No contest history yet</h4>
            <p className="mt-1 max-w-[240px] text-[11px] leading-relaxed text-white/45">
              Participate in your first LeetCode contest to start tracking your rating and performance.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-white/[0.04] pt-2 text-[10px] text-white/30">
        Weekly & Biweekly Contests
      </div>
    </motion.div>
  )
}
