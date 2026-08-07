import { motion } from 'framer-motion'
import { Star, GitFork, Pin } from 'lucide-react'
import type { PinnedRepo } from '../../data/github'

const LANGUAGE_COLORS: Record<string, string> = {
  Java: 'text-[#e76f00]',
  'C++': 'text-[#f34b7d]',
  Python: 'text-[#3572A5]',
  JavaScript: 'text-[#f1e05a]',
  TypeScript: 'text-[#3178c6]',
  React: 'text-[#61dafb]',
  'Spring Boot': 'text-[#6db33f]',
  SQL: 'text-[#e38c00]',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function PinnedProjects({ projects }: { projects: PinnedRepo[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center gap-2">
        <Pin className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white/80">Pinned Projects</h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {projects.map((repo) => (
          <motion.div
            key={repo.id}
            variants={itemVariants}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.12]"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="truncate text-sm font-semibold text-blue-400">{repo.name}</h4>
              <div className="flex shrink-0 items-center gap-2 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" /> {repo.forks}
                </span>
              </div>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-white/40">{repo.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className={`font-medium ${LANGUAGE_COLORS[repo.language] ?? 'text-white/60'}`}>
                {repo.language}
              </span>
              <span className="text-white/30">Updated {repo.lastUpdated}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {repo.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
