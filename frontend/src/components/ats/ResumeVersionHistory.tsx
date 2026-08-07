import { motion } from 'framer-motion'
import { History, TrendingUp } from 'lucide-react'
import type { ResumeVersion } from '../../data/ats'

export function ResumeVersionHistory({ versions }: { versions: ResumeVersion[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <History className="h-4 w-4 text-white/40" />
        Resume Version History
      </h3>

      <div className="space-y-3">
        {versions.map((version, i) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="relative flex flex-col gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
                <span className="text-xs font-semibold text-blue-400">{version.version}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/80">{version.changes}</p>
                <p className="text-xs text-white/40">{version.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:shrink-0">
              <span className="text-sm font-semibold text-white/80">
                {version.score}
                <span className="text-xs font-normal text-white/40">/100</span>
              </span>
              {version.change > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  <TrendingUp className="h-3 w-3" />+{version.change}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
