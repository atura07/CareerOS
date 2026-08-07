import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function MonthlyProgress({ data }: { data: AnalyticsData }) {
  const max = Math.max(...data.monthly.map((m) => m.applications))

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <BarChart3 className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Monthly Progress</h3>
      </div>

      <div className="flex h-40 items-end justify-between gap-3">
        {data.monthly.map((month, i) => (
          <div key={month.month} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[11px] font-medium text-white/50">{month.applications}</span>
            <div className="flex h-28 w-full items-end justify-center gap-1">
              <motion.div
                className="w-3 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                initial={{ height: 0 }}
                animate={{ height: `${(month.applications / max) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              <motion.div
                className="w-3 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400"
                initial={{ height: 0 }}
                animate={{ height: `${(month.offers / max) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.08 + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
            <span className="text-xs text-white/40">{month.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-4 border-t border-white/[0.04] pt-3">
        <span className="flex items-center gap-1.5 text-[11px] text-white/40">
          <span className="h-2 w-2 rounded-full bg-blue-500" /> Applications
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-white/40">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Offers
        </span>
      </div>
    </div>
  )
}
