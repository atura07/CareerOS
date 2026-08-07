import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Triangle,
  Star,
  Percent,
  Send,
  Award,
  Flame,
} from 'lucide-react'
import type { LeetCodeStats } from '../../data/leetcode'

interface StatItem {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}

export function StatsCards({ stats }: { stats: LeetCodeStats }) {
  const items: StatItem[] = [
    { label: 'Problems Solved', value: stats.problemsSolved, icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-emerald-400' },
    { label: 'Easy', value: stats.easy, icon: <Circle className="h-4 w-4" />, color: 'text-emerald-400' },
    { label: 'Medium', value: stats.medium, icon: <Triangle className="h-4 w-4" />, color: 'text-amber-400' },
    { label: 'Hard', value: stats.hard, icon: <Star className="h-4 w-4" />, color: 'text-rose-400' },
    { label: 'Acceptance Rate', value: `${stats.acceptanceRate}%`, icon: <Percent className="h-4 w-4" />, color: 'text-blue-400' },
    { label: 'Submissions', value: stats.submissions.toLocaleString(), icon: <Send className="h-4 w-4" />, color: 'text-purple-400' },
    { label: 'Badges', value: stats.badges, icon: <Award className="h-4 w-4" />, color: 'text-yellow-400' },
    { label: 'Current Streak', value: `${stats.currentStreak}d`, icon: <Flame className="h-4 w-4" />, color: 'text-orange-400' },
    { label: 'Longest Streak', value: `${stats.longestStreak}d`, icon: <Flame className="h-4 w-4" />, color: 'text-red-400' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className={item.color}>{item.icon}</span>
            <p className="text-[10px] uppercase tracking-wide text-white/40">{item.label}</p>
          </div>
          <p className="text-xl font-semibold tracking-tight text-white/90">{item.value}</p>
        </motion.div>
      ))}
    </div>
  )
}
