import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import type { DailyChallenge as DailyChallengeType, Difficulty } from '../../types/leetcode'

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

export function DailyChallenge({ challenge }: { challenge?: DailyChallengeType | null }) {
  const isSolved = challenge?.status === 'Solved'
  const diff = challenge?.difficulty || 'Medium'
  const title = challenge?.title || 'Daily Coding Challenge'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-500/20">
              <CalendarDays className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-white/90">Daily Challenge</h3>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-white/40">Today</span>
        </div>

        <p className="text-sm font-medium text-white/85 line-clamp-2">{title}</p>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium ${DIFFICULTY_COLOR[diff] || 'text-white/60'}`}
          >
            {diff}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
              isSolved
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                : 'border-white/[0.08] bg-white/[0.03] text-white/50'
            }`}
          >
            {isSolved ? (
              <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-400" />
            ) : (
              <Circle className="mr-1 h-3 w-3 text-white/40" />
            )}
            {challenge?.status || 'Active'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-white/[0.04]">
        <a
          href="https://leetcode.com/problemset/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/90 transition hover:text-amber-300 hover:underline"
        >
          Open in LeetCode
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  )
}
