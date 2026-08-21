export const DIFFICULTY_OPTIONS = ['All', 'Hard', 'Medium', 'Easy'] as const
export type DifficultyFilter = typeof DIFFICULTY_OPTIONS[number]

interface CompanyFilterProps {
  active: string
  onChange: (filter: string) => void
}

export function CompanyFilter({ active, onChange }: CompanyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DIFFICULTY_OPTIONS.map((opt) => {
        const isActive = active === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
              isActive
                ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
                : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/[0.16] hover:text-white/70'
            }`}
          >
            {opt === 'All' ? 'All Difficulties' : `${opt} Difficulty`}
          </button>
        )
      })}
    </div>
  )
}
