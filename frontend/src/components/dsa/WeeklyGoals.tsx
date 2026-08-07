import { motion } from 'framer-motion'
import { Target, CheckCircle2, Circle } from 'lucide-react'

interface WeeklyGoalItem {
  id: string
  label: string
  done: boolean
}

interface WeeklyGoalsProps {
  goals: WeeklyGoalItem[]
  completed: number
  total: number
}

export function WeeklyGoals({ goals, completed, total }: WeeklyGoalsProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const remaining = total - completed

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90">
        <Target className="h-4 w-4 text-blue-400" /> Weekly Goals
      </h3>

      <div className="mb-2 flex items-end justify-between">
        <span className="text-2xl font-semibold text-white/90">{percent}%</span>
        <span className="text-xs text-white/40">
          {remaining} task{remaining === 1 ? '' : 's'} remaining
        </span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
        />
      </div>

      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
          >
            {goal.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-white/30" />
            )}
            <span
              className={`text-sm ${goal.done ? 'text-white/50 line-through' : 'text-white/80'}`}
            >
              {goal.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
