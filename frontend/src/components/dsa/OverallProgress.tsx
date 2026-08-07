import { motion } from 'framer-motion'
import { Code2, CheckCircle2, Clock, Target, Flame, CalendarCheck } from 'lucide-react'
import type { DSAStats } from '../../data/dsa'

interface OverallProgressProps {
  stats: DSAStats
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function OverallProgress({ stats }: OverallProgressProps) {
  const remaining = stats.totalProblems - stats.solvedProblems
  const percent = Math.round((stats.solvedProblems / stats.totalProblems) * 100)

  const cards = [
    { label: 'Total Problems', value: stats.totalProblems, icon: <Code2 className="h-4 w-4" />, color: 'text-blue-400' },
    { label: 'Solved', value: stats.solvedProblems, icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-emerald-400' },
    { label: 'Remaining', value: remaining, icon: <Clock className="h-4 w-4" />, color: 'text-amber-400' },
    { label: 'Daily Streak', value: `${stats.dailyStreak}d`, icon: <Flame className="h-4 w-4" />, color: 'text-orange-400' },
    { label: 'Weekly Goal', value: `${stats.weeklyProgress}/${stats.weeklyGoal}`, icon: <Target className="h-4 w-4" />, color: 'text-violet-400' },
    { label: 'Overall Progress', value: `${percent}%`, icon: <CalendarCheck className="h-4 w-4" />, color: 'text-cyan-400' },
  ]

  return (
    <motion.div
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={itemVariants}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06]">
            <span className={card.color}>{card.icon}</span>
          </div>
          <p className="text-xl font-semibold tracking-tight text-white/90">{card.value}</p>
          <p className="text-xs text-white/40">{card.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
