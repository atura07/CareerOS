import { Gauge } from 'lucide-react'
import type { Difficulty } from '../../data/interview'
import { DIFFICULTIES } from '../../data/interview'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
  Medium: 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  Hard: 'border-rose-500/30 bg-rose-500/14 text-rose-400',
}

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (d: Difficulty) => void
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/50">
        <Gauge className="h-3.5 w-3.5" />
        Difficulty
      </p>
      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
              value === d
                ? DIFFICULTY_STYLES[d]
                : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}
