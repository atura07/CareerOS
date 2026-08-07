import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import type { CalendarEvent } from '../../data/dsa'

interface StudyCalendarProps {
  events: CalendarEvent[]
}

const TYPE_STYLES: Record<CalendarEvent['type'], string> = {
  Study: 'border-blue-500/30 bg-blue-500/14 text-blue-400',
  Revision: 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  'Mock Interview': 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
}

export function StudyCalendar({ events }: StudyCalendarProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90">
        <CalendarDays className="h-4 w-4 text-blue-400" /> Study Calendar
      </h3>
      <div className="space-y-2">
        {events.map((event) => (
          <motion.div
            key={`${event.date}-${event.title}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                <span className="text-[9px] uppercase text-white/40">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-sm font-semibold text-white/80">
                  {new Date(event.date + 'T00:00:00').getDate()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-white/80">{event.title}</p>
                <p className="text-xs text-white/40">{event.date}</p>
              </div>
            </div>
            <span
              className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${TYPE_STYLES[event.type]}`}
            >
              {event.type}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
