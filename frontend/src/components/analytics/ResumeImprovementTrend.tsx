import { motion } from 'framer-motion'
import { FileUp } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function ResumeImprovementTrend({ data }: { data: AnalyticsData }) {
  const points = data.resumeImprovement
  const max = Math.max(...points.map((p) => p.atsScore))

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/14 ring-1 ring-emerald-500/20">
          <FileUp className="h-4 w-4 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Resume Improvement Trend</h3>
      </div>

      <div className="flex h-40 items-end justify-between gap-3">
        {points.map((p, i) => (
          <div key={p.version} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-semibold text-white/70">{p.atsScore}</span>
            <motion.div
              className="flex w-10 items-end justify-center rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400"
              initial={{ height: 0 }}
              animate={{ height: `${(p.atsScore / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="pb-1 text-[10px] text-white/70">ATS</span>
            </motion.div>
            <span className="text-xs text-white/40">{p.version}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
