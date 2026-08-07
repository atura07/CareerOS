import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import type { WeeklyGoal } from '../../data/analytics'

interface WeeklyGoalsProps {
  goals: WeeklyGoal[]
}

export function WeeklyGoals({ goals }: WeeklyGoalsProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <Target className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Weekly Goals</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal, i) => {
          const pct = Math.min(
            100,
            Math.round((goal.current / goal.target) * 100),
          )
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-white/70">{goal.label}</span>
                <span className="text-white/40">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
