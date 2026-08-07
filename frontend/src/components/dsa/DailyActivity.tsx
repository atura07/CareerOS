import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import type { ActivityDay, DSAStats } from '../../data/dsa'

interface DailyActivityProps {
  data: ActivityDay[]
  stats: DSAStats
}

function intensityClass(count: number): string {
  if (count === 0) return 'bg-white/[0.04]'
  if (count <= 2) return 'bg-emerald-500/30'
  if (count <= 4) return 'bg-emerald-500/50'
  return 'bg-emerald-400'
}

export function DailyActivity({ data, stats }: DailyActivityProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">Daily Activity</h3>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-orange-400" /> {stats.dailyStreak}d
          </span>
          <span className="text-white/25">·</span>
          <span>Longest {stats.longestStreak}d</span>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {data.map((day) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            title={`${day.date}: ${day.count} problems`}
            className={`aspect-square rounded-md ${intensityClass(day.count)}`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-white/30">
        Less
        {[0, 1, 3, 5].map((v) => (
          <span key={v} className={`h-2.5 w-2.5 rounded-sm ${intensityClass(v)}`} />
        ))}
        More
      </div>
    </div>
  )
}
