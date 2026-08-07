import { motion } from 'framer-motion'
import { CalendarClock } from 'lucide-react'
import type { RevisionItem } from '../../data/dsa'

interface RevisionPlannerProps {
  items: RevisionItem[]
}

const STATUS_STYLES: Record<RevisionItem['status'], string> = {
  'Due Today': 'border-rose-500/30 bg-rose-500/14 text-rose-400',
  Upcoming: 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  Completed: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
}

export function RevisionPlanner({ items }: RevisionPlannerProps) {
  const dueToday = items.filter((i) => i.status === 'Due Today').length
  const upcoming = items.filter((i) => i.status === 'Upcoming').length
  const completed = items.filter((i) => i.status === 'Completed').length

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <CalendarClock className="h-4 w-4 text-blue-400" /> Revision Planner
        </h3>
        <span className="text-xs text-white/40">
          {dueToday} due · {upcoming} upcoming · {completed} done
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-white/80">{item.topic}</p>
              <p className="text-xs text-white/40">Due {item.due}</p>
            </div>
            <span
              className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[item.status]}`}
            >
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
