import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle2 } from 'lucide-react'
import type { DailyChallenge } from '../../data/leetcode'

const DIFFICULTY_COLOR: Record<DailyChallenge['difficulty'], string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

export function DailyChallenge({ challenge }: { challenge: DailyChallenge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
          <CalendarDays className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight text-white/90">Daily Challenge</h3>
      </div>
      <p className="text-white/80">{challenge.title}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium ${DIFFICULTY_COLOR[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
          <CheckCircle2 className="mr-1 h-3 w-3" /> {challenge.status}
        </span>
      </div>
    </motion.div>
  )
}
