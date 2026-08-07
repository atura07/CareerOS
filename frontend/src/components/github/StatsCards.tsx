import { motion } from 'framer-motion'
import {
  Folder,
  Star,
  GitFork,
  Users,
  UserPlus,
  GitCommitHorizontal,
  GitPullRequest,
  AlertCircle,
} from 'lucide-react'
import type { GitHubStats } from '../../data/github'

const ITEMS: { key: keyof GitHubStats; label: string; icon: typeof Star }[] = [
  { key: 'repositories', label: 'Repositories', icon: Folder },
  { key: 'stars', label: 'Stars', icon: Star },
  { key: 'commits', label: 'Commits', icon: GitCommitHorizontal },
  { key: 'followers', label: 'Followers', icon: Users },
  { key: 'following', label: 'Following', icon: UserPlus },
  { key: 'pullRequests', label: 'Pull Requests', icon: GitPullRequest },
  { key: 'issues', label: 'Issues', icon: AlertCircle },
  { key: 'forks', label: 'Forks', icon: GitFork },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function StatsCards({ stats }: { stats: GitHubStats }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.key}
            variants={itemVariants}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur"
          >
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
              <Icon className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-xl font-semibold tracking-tight text-white/90">
              {stats[item.key].toLocaleString()}
            </p>
            <p className="text-xs text-white/40">{item.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
