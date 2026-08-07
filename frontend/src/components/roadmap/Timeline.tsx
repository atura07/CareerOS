import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import type { WeekPlan } from '../../data/roadmap'
import { WeeklyPlan } from './WeeklyPlan'

interface TimelineProps {
  plans: WeekPlan[]
}

export function Timeline({ plans }: TimelineProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
          <CalendarDays className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Weekly Timeline</h3>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => (
          <motion.div
            key={plan.weekNumber}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: plan.weekNumber * 0.03, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <WeeklyPlan plan={plan} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
