import { motion } from 'framer-motion'
import { CalendarRange } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

const SERIES = [
  { key: 'applications', label: 'Applications', color: 'bg-blue-500' },
  { key: 'interviews', label: 'Interviews', color: 'bg-violet-500' },
  { key: 'offers', label: 'Offers', color: 'bg-emerald-500' },
] as const

export function WeeklyProgress({ data }: { data: AnalyticsData }) {
  const max = Math.max(...data.weekly.map((w) => w.applications))

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <CalendarRange className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Weekly Progress</h3>
      </div>

      <div className="space-y-4">
        {data.weekly.map((week, i) => (
          <div key={week.week}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-white/50">{week.week}</span>
              <span className="text-white/30">
                {week.applications} apps · {week.interviews} int · {week.offers} offer
              </span>
            </div>
            <div className="flex h-3 gap-1 overflow-hidden rounded-full bg-white/[0.06]">
              {SERIES.map((s) => (
                <motion.div
                  key={s.key}
                  className={`${s.color} h-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(week[s.key] / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-white/[0.04] pt-3">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-[11px] text-white/40">
            <span className={`h-2 w-2 rounded-full ${s.color}`} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
