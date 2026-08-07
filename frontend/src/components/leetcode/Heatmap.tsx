import { motion } from 'framer-motion'
import type { HeatmapDay } from '../../data/leetcode'

function getColor(count: number): string {
  if (count === 0) return 'bg-white/[0.04]'
  if (count === 1) return 'bg-emerald-500/20'
  if (count === 2) return 'bg-emerald-500/35'
  if (count === 3) return 'bg-emerald-500/50'
  if (count === 4) return 'bg-emerald-500/65'
  if (count === 5) return 'bg-emerald-500/80'
  return 'bg-emerald-500'
}

export function Heatmap({ data }: { data: HeatmapDay[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-white/90">
          Contribution Heatmap
        </h3>
        <p className="text-xs text-white/40">Last 365 days</p>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
        {data.map((day) => (
          <div
            key={day.date}
            title={`${day.date.slice(0, 10)}: ${day.count} submissions`}
            className={`h-3 w-3 shrink-0 rounded-sm ${getColor(day.count)}`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-white/40">
        <span>Less</span>
        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
          <span key={n} className={`h-3 w-3 rounded-sm ${getColor(n)}`} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  )
}
