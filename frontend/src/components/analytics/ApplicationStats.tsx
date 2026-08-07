import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function ApplicationStats({ data }: { data: AnalyticsData }) {
  const total = data.applicationStats.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <Briefcase className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Application Statistics</h3>
      </div>

      <div className="space-y-3">
        {data.applicationStats.map((stat, i) => {
          const pct = Math.round((stat.count / total) * 100)
          return (
            <div key={stat.status}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-white/60">{stat.status}</span>
                <span className="font-semibold text-white/80">{stat.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className={`h-full rounded-full ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
