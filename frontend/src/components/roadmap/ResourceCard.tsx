import { motion } from 'framer-motion'
import { BookOpen, ArrowUpRight } from 'lucide-react'

interface ResourceCardProps {
  resources: string[]
}

export function ResourceCard({ resources }: ResourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90">
        <BookOpen className="h-4 w-4 text-blue-400" />
        Learning Resources
      </h3>
      <ul className="space-y-2">
        {resources.map((resource) => (
          <li
            key={resource}
            className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-sm text-white/70"
          >
            <span>{resource}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/30" />
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
