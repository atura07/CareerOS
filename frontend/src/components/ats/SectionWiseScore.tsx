import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import type { SectionScore } from '../../data/ats'

function scoreColor(score: number) {
  if (score >= 85) return 'from-emerald-500 to-teal-400'
  if (score >= 70) return 'from-blue-500 to-indigo-400'
  if (score >= 50) return 'from-amber-500 to-orange-400'
  return 'from-rose-500 to-red-400'
}

function scoreText(score: number) {
  if (score >= 85) return 'text-emerald-400'
  if (score >= 70) return 'text-blue-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-rose-400'
}

export function SectionWiseScore({ sections }: { sections: SectionScore[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <LayoutGrid className="h-4 w-4 text-white/40" />
        Section-wise Score
      </h3>

      <div className="space-y-3">
        {sections.map((section, i) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-white/70">{section.name}</span>
              <span className={`text-xs font-semibold ${scoreText(section.score)}`}>
                {section.score}/100
              </span>
            </div>
            <div className="mb-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${section.score}%` }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className={`h-full rounded-full bg-gradient-to-r ${scoreColor(section.score)}`}
              />
            </div>
            <p className="text-[11px] text-white/40">{section.note}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
