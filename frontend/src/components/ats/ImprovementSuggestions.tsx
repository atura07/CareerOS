import { motion } from 'framer-motion'
import { ListChecks, AlertTriangle, Circle, Info } from 'lucide-react'
import type { Improvement, Priority } from '../../data/ats'

const PRIORITY_STYLES: Record<Priority, { badge: string; icon: typeof AlertTriangle }> = {
  High: { badge: 'border-rose-500/30 bg-rose-500/14 text-rose-400', icon: AlertTriangle },
  Medium: { badge: 'border-amber-500/30 bg-amber-500/14 text-amber-400', icon: Circle },
  Low: { badge: 'border-blue-500/30 bg-blue-500/14 text-blue-400', icon: Info },
}

const ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }

export function ImprovementSuggestions({ improvements }: { improvements: Improvement[] }) {
  const sorted = [...improvements].sort((a, b) => ORDER[a.priority] - ORDER[b.priority])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <ListChecks className="h-4 w-4 text-white/40" />
        Improvement Suggestions
      </h3>

      <div className="space-y-3">
        {sorted.map((item, i) => {
          const style = PRIORITY_STYLES[item.priority]
          const Icon = style.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5"
            >
              <div
                className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${style.badge}`}
              >
                <Icon className="h-3 w-3" />
                {item.priority}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/80">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/40">{item.detail}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
