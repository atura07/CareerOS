import { motion } from 'framer-motion'
import { Star, GitFork } from 'lucide-react'
import type { Repository } from '../../data/github'

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

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function RepositoryList({ repositories }: { repositories: Repository[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80">Repository List</h3>
        <span className="text-xs text-white/40">{repositories.length} repositories</span>
      </div>

      <motion.ul
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
        initial="hidden"
        animate="visible"
        className="divide-y divide-white/[0.05]"
      >
        {repositories.map((repo) => (
          <motion.li
            key={repo.id}
            variants={itemVariants}
            className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-sm font-semibold text-blue-400">{repo.name}</h4>
                <span className={`shrink-0 text-[11px] font-medium ${LANGUAGE_COLORS[repo.language] ?? 'text-white/60'}`}>
                  {repo.language}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-white/40">{repo.description}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/40"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" /> {repo.forks}
              </span>
              <span className="text-white/30">{repo.lastUpdated}</span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}
