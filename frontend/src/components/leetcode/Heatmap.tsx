import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import type { HeatmapDay } from '../../types/leetcode'
import { generateHeatmapData } from '../../services/leetcode'

function getColor(count: number): string {
  if (count <= 0) return 'bg-white/[0.04]'
  if (count === 1) return 'bg-emerald-500/25'
  if (count === 2) return 'bg-emerald-500/40'
  if (count === 3) return 'bg-emerald-500/55'
  if (count === 4) return 'bg-emerald-500/70'
  if (count === 5) return 'bg-emerald-500/85'
  return 'bg-emerald-400'
}

export function Heatmap({ data }: { data?: HeatmapDay[] | null }) {
  const days = data && data.length > 0 ? data : generateHeatmapData()
  const totalSubmissions = days.reduce((sum, d) => sum + d.count, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 ring-1 ring-orange-500/20">
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white/90">
              Contribution Heatmap
            </h3>
            <p className="text-[11px] text-white/40">Last 365 days of problem solving activity</p>
          </div>
        </div>

        {totalSubmissions > 0 && (
          <span className="text-xs font-semibold text-white/70">
            {totalSubmissions.toLocaleString()} Submissions
          </span>
        )}
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date.slice(0, 10)}: ${day.count} submissions`}
            className={`h-3 w-3 shrink-0 rounded-sm transition-colors hover:ring-1 hover:ring-white/40 ${getColor(
              day.count
            )}`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
        <span>Submission frequency</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <span key={n} className={`h-3 w-3 rounded-sm ${getColor(n)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </motion.div>
  )
}
