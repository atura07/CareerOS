import { motion } from 'framer-motion'
import type { TopicProgress } from '../../data/dsa'

interface TopicProgressGridProps {
  topics: TopicProgress[]
}

const STATUS_STYLES: Record<TopicProgress['status'], string> = {
  Completed: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
  'In Progress': 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  'Not Started': 'border-white/[0.08] bg-white/[0.03] text-white/40',
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function TopicProgressGrid({ topics }: TopicProgressGridProps) {
  return (
    <motion.div
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {topics.map((topic) => {
        const percent = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0
        return (
          <motion.div
            key={topic.id}
            variants={itemVariants}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-white/90">{topic.name}</h4>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[topic.status]}`}
              >
                {topic.status}
              </span>
            </div>

            <div className="mb-2 flex items-end justify-between">
              <span className="text-lg font-semibold text-white/90">
                {topic.solved}
                <span className="text-sm font-normal text-white/40">/{topic.total}</span>
              </span>
              <span className="text-xs text-white/40">{percent}%</span>
            </div>

            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              />
            </div>

            <div className="flex gap-1.5 text-[10px]">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                Easy {topic.easysolved}
              </span>
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-amber-400">
                Med {topic.mediumSolved}
              </span>
              <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-rose-400">
                Hard {topic.hardSolved}
              </span>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
