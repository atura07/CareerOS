import { motion } from 'framer-motion'
import { GitCommitHorizontal, GitPullRequest, AlertCircle, FolderGit2 } from 'lucide-react'
import type { ActivityEvent } from '../../data/github'

const TYPE_META: Record<ActivityEvent['type'], { icon: typeof GitCommitHorizontal; color: string }> = {
  commit: { icon: GitCommitHorizontal, color: 'text-emerald-400' },
  'pull-request': { icon: GitPullRequest, color: 'text-purple-400' },
  issue: { icon: AlertCircle, color: 'text-amber-400' },
  repo: { icon: FolderGit2, color: 'text-blue-400' },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <h3 className="mb-4 text-sm font-semibold text-white/80">Activity Timeline</h3>
      <motion.ol
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
        className="relative space-y-4 before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-px before:bg-white/[0.08]"
      >
        {events.map((event) => {
          const meta = TYPE_META[event.type]
          const Icon = meta.icon
          return (
            <motion.li key={event.id} variants={itemVariants} className="relative flex gap-3">
              <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ${meta.color}`}>
                <Icon className="h-3 w-3" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/80">{event.title}</p>
                <p className="truncate text-xs text-white/40">{event.detail}</p>
                <p className="mt-0.5 text-[10px] text-white/30">{event.date}</p>
              </div>
            </motion.li>
          )
        })}
      </motion.ol>
    </motion.div>
  )
}
