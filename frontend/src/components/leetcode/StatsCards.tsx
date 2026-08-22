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
import type { LeetCodeStats, Difficulty } from '../../types/leetcode'

interface StatsCardsProps {
  stats: LeetCodeStats
  selectedDifficulty?: Difficulty | null
  onSelectDifficulty?: (difficulty: Difficulty | null) => void
}

interface StatItem {
  id: string
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  difficulty?: Difficulty | null
  interactive?: boolean
}

export function StatsCards({
  stats,
  selectedDifficulty,
  onSelectDifficulty,
}: StatsCardsProps) {
  const items: StatItem[] = [
    {
      id: 'total',
      label: 'Problems Solved',
      value: stats.problemsSolved ?? 0,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: 'text-emerald-400',
      difficulty: null,
      interactive: true,
    },
    {
      id: 'easy',
      label: 'Easy Solved',
      value: stats.easy ?? 0,
      icon: <Circle className="h-4 w-4" />,
      color: 'text-emerald-400',
      difficulty: 'Easy',
      interactive: true,
    },
    {
      id: 'medium',
      label: 'Medium Solved',
      value: stats.medium ?? 0,
      icon: <Triangle className="h-4 w-4" />,
      color: 'text-amber-400',
      difficulty: 'Medium',
      interactive: true,
    },
    {
      id: 'hard',
      label: 'Hard Solved',
      value: stats.hard ?? 0,
      icon: <Star className="h-4 w-4" />,
      color: 'text-rose-400',
      difficulty: 'Hard',
      interactive: true,
    },
    {
      id: 'acceptance',
      label: 'Acceptance Rate',
      value: stats.acceptanceRate > 0 ? `${stats.acceptanceRate}%` : '—',
      icon: <Percent className="h-4 w-4" />,
      color: 'text-blue-400',
    },
    {
      id: 'submissions',
      label: 'Submissions',
      value: stats.submissions > 0 ? stats.submissions.toLocaleString() : '—',
      icon: <Send className="h-4 w-4" />,
      color: 'text-purple-400',
    },
    {
      id: 'badges',
      label: 'Badges',
      value: stats.badges > 0 ? stats.badges : '—',
      icon: <Award className="h-4 w-4" />,
      color: 'text-yellow-400',
    },
    {
      id: 'streak',
      label: 'Current Streak',
      value: stats.currentStreak > 0 ? `${stats.currentStreak}d` : '0d',
      icon: <Flame className="h-4 w-4" />,
      color: 'text-orange-400',
    },
    {
      id: 'longest-streak',
      label: 'Longest Streak',
      value: stats.longestStreak > 0 ? `${stats.longestStreak}d` : stats.currentStreak > 0 ? `${stats.currentStreak}d` : '0d',
      icon: <Flame className="h-4 w-4" />,
      color: 'text-red-400',
    },
  ]

  const handleCardClick = (item: StatItem) => {
    if (!item.interactive || !onSelectDifficulty) return

    if (item.difficulty === undefined) return

    if (item.difficulty === null) {
      onSelectDifficulty(null)
    } else {
      const nextDiff = selectedDifficulty === item.difficulty ? null : item.difficulty
      onSelectDifficulty(nextDiff)
    }

    const recentEl = document.getElementById('recent-problems-section')
    if (recentEl) {
      recentEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
      {items.map((item, i) => {
        const isSelected =
          item.difficulty !== undefined &&
          item.difficulty !== null &&
          selectedDifficulty === item.difficulty

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.04,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
            onClick={() => handleCardClick(item)}
            className={`group rounded-2xl border p-4 backdrop-blur transition-all duration-200 ${
              item.interactive ? 'cursor-pointer' : 'cursor-default'
            } ${
              isSelected
                ? 'border-amber-400/50 bg-amber-500/[0.08] shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
                : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.06]'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={item.color}>{item.icon}</span>
                <p className="text-[10px] uppercase tracking-wide text-white/45">
                  {item.label}
                </p>
              </div>
              {item.interactive && item.difficulty && (
                <span className="opacity-0 text-[10px] text-white/40 transition group-hover:opacity-100">
                  {isSelected ? 'Filtered' : 'Filter'}
                </span>
              )}
            </div>
            <p className="text-xl font-semibold tracking-tight text-white/90">
              {item.value}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
