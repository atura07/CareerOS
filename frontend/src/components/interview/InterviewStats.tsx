import { motion } from 'framer-motion'
import { ClipboardList, TrendingUp, Award, CalendarClock, Clock } from 'lucide-react'
import type { InterviewRecord } from '../../data/interview'

interface InterviewStatsProps {
  records: InterviewRecord[]
}

function StatCard({
  icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur"
    >
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] ${accent}`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-white/90">{value}</p>
      <p className="mt-0.5 text-xs text-white/40">{label}</p>
    </motion.div>
  )
}

export function InterviewStats({ records }: InterviewStatsProps) {
  const completed = records
  const scores = completed.map((r) => r.score)
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const best = scores.length > 0 ? Math.max(...scores) : 0
  const totalMinutes = completed.reduce((a, r) => a + r.duration, 0)
  const hours = (totalMinutes / 60).toFixed(1)
  const last = completed.length > 0 ? completed[0].date : '—'

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        icon={<ClipboardList className="h-4 w-4 text-blue-400" />}
        accent="text-blue-400"
        label="Total Interviews"
        value={String(completed.length)}
        delay={0}
      />
      <StatCard
        icon={<TrendingUp className="h-4 w-4 text-purple-400" />}
        accent="text-purple-400"
        label="Average Score"
        value={`${avg}%`}
        delay={0.05}
      />
      <StatCard
        icon={<Award className="h-4 w-4 text-amber-400" />}
        accent="text-amber-400"
        label="Best Score"
        value={`${best}%`}
        delay={0.1}
      />
      <StatCard
        icon={<CalendarClock className="h-4 w-4 text-emerald-400" />}
        accent="text-emerald-400"
        label="Last Interview"
        value={last}
        delay={0.15}
      />
      <StatCard
        icon={<Clock className="h-4 w-4 text-cyan-400" />}
        accent="text-cyan-400"
        label="Hours Practiced"
        value={`${hours}h`}
        delay={0.2}
      />
    </div>
  )
}
