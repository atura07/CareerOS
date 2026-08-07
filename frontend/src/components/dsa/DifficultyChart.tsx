import { motion } from 'framer-motion'
import type { Difficulty } from '../../data/dsa'

interface DifficultySegment {
  difficulty: Difficulty
  solved: number
  total: number
}

interface DifficultyChartProps {
  data: DifficultySegment[]
}

const COLORS: Record<Difficulty, string> = {
  Easy: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  Hard: 'bg-rose-400',
}

const TEXT_COLORS: Record<Difficulty, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

export function DifficultyChart({ data }: DifficultyChartProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 text-sm font-semibold text-white/90">Difficulty Distribution</h3>
      <div className="space-y-4">
        {data.map((item) => {
          const percent = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0
          return (
            <div key={item.difficulty}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={`font-medium ${TEXT_COLORS[item.difficulty]}`}>
                  {item.difficulty}
                </span>
                <span className="text-white/40">
                  {item.solved}/{item.total} · {percent}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  className={`h-full rounded-full ${COLORS[item.difficulty]}`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
