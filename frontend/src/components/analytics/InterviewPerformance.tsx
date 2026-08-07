import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function InterviewPerformance({ data }: { data: AnalyticsData }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/14 ring-1 ring-violet-500/20">
          <Mic className="h-4 w-4 text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Interview Performance</h3>
      </div>

      <div className="space-y-4">
        {data.interviewPerformance.map((item, i) => {
          const pct = Math.round((item.passed / item.total) * 100)
          return (
            <div key={item.round}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-white/60">{item.round}</span>
                <span className="font-semibold text-white/80">
                  {item.passed}/{item.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
