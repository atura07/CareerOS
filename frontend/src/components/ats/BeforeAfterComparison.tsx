import { motion } from 'framer-motion'
import { GitCompareArrows, ArrowRight } from 'lucide-react'
import type { BeforeAfter } from '../../data/ats'

export function BeforeAfterComparison({ metrics }: { metrics: BeforeAfter[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <GitCompareArrows className="h-4 w-4 text-white/40" />
        Before vs After
      </h3>

      <div className="space-y-3">
        {metrics.map((metric, i) => {
          const delta = metric.after - metric.before
          return (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5"
            >
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-white/70">{metric.metric}</span>
                <span className="text-xs font-semibold text-emerald-400">+{delta}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-white/20 transition-all duration-700"
                    style={{ width: `${metric.before}%` }}
                  />
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.after}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-white/40">
                <span>{metric.before}</span>
                <span>{metric.after}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
