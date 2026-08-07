import { motion } from 'framer-motion'
import { Tags, CheckCircle2, XCircle } from 'lucide-react'
import type { KeywordItem } from '../../data/ats'

export function KeywordMatch({ keywords }: { keywords: KeywordItem[] }) {
  const matched = keywords.filter((k) => k.matched)
  const missing = keywords.filter((k) => !k.matched)
  const percent = Math.round((matched.length / keywords.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <Tags className="h-4 w-4 text-white/40" />
        Keyword Analysis
      </h3>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
        <div>
          <p className="text-xs text-white/40">Keyword Match</p>
          <p className="text-2xl font-semibold text-white/90">{percent}%</p>
        </div>
        <p className="text-xs text-white/40">
          {matched.length} matched / {keywords.length} total
        </p>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
        />
      </div>

      <div className="space-y-3">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Matched
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((k) => (
              <span
                key={k.keyword}
                className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400"
              >
                {k.keyword}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-rose-400">
            <XCircle className="h-3.5 w-3.5" /> Missing
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((k) => (
              <span
                key={k.keyword}
                className="inline-flex items-center rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-400"
              >
                {k.keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
