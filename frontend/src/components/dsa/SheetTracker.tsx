import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import type { Sheet } from '../../data/dsa'

interface SheetTrackerProps {
  sheet: Sheet
}

function percent(solved: number, total: number): number {
  return total > 0 ? Math.round((solved / total) * 100) : 0
}

export function SheetTracker({ sheet }: SheetTrackerProps) {
  const sheetPercent = percent(sheet.solved, sheet.total)
  const remaining = sheet.total - sheet.solved

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
            <LayoutGrid className="h-5 w-5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white/90">{sheet.name}</h3>
            <p className="text-xs text-white/40">by {sheet.author}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-white/60">
          {sheet.solved} / {sheet.total}
        </span>
      </div>

<div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-white/40">{sheetPercent}% complete</span>
        <span className="text-white/40">{remaining} remaining</span>
      </div>
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${sheetPercent}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
        />
      </div>

      <div className="space-y-2.5">
{sheet.topics.map((topic) => {
          const tp = percent(topic.solved, topic.total)
          return (
            <div key={topic.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-white/60">{topic.name}</span>
                <span className="text-white/40">
                  {topic.solved}/{topic.total}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tp}%` }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  className="h-full rounded-full bg-blue-500/60"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
