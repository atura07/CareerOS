import { motion } from 'framer-motion'
import {
  FileText,
  BarChart3,
  Code2,
  GitBranch,
  Mic,
  Briefcase,
} from 'lucide-react'
import type { ActivityItem } from '../../data/analytics'

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

const ICONS: Record<string, typeof FileText> = {
  FileText,
  BarChart3,
  Code2,
  GitBranch,
  Mic,
  Briefcase,
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 text-sm font-semibold text-white/90">
        Recent Activity
      </h3>
      <div className="relative space-y-5">
        {/* Vertical line */}
        <div className="absolute bottom-2 left-[13px] top-2 w-px bg-white/[0.08]" />
        {activities.map((act, i) => {
          const Icon = ICONS[act.icon] ?? FileText
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative flex items-start gap-3"
            >
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#05070c] ring-1 ring-white/[0.08]">
                <Icon className={`h-3.5 w-3.5 ${act.color}`} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white/80">
                    {act.title}
                  </p>
                  <span className="shrink-0 text-[11px] text-white/30">
                    {act.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  {act.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
