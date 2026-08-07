import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

const LEVEL_STYLES = [
  'bg-white/[0.04]',
  'bg-blue-500/25',
  'bg-blue-500/45',
  'bg-blue-500/70',
  'bg-blue-500',
]

export function OverallHeatmap({ data }: { data: AnalyticsData }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <CalendarDays className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Overall Activity Heatmap</h3>
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {data.heatmap.map((day, i) => (
          <motion.div
            key={day.day}
            title={`Day ${day.day} · level ${day.level}`}
            className={`aspect-square rounded-md ${LEVEL_STYLES[day.level]}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: i * 0.01 }}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-white/30">
        <span>Less</span>
        {LEVEL_STYLES.map((s) => (
          <span key={s} className={`h-2.5 w-2.5 rounded-sm ${s}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
