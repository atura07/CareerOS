import type { CompanyStatus } from '../../data/companies'

export const FILTER_OPTIONS: { value: CompanyStatus | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Open', label: 'Open' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Closed', label: 'Closed' },
]

interface CompanyFilterProps {
  active: CompanyStatus | 'All'
  onChange: (status: CompanyStatus | 'All') => void
}

export function CompanyFilter({ active, onChange }: CompanyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_OPTIONS.map((opt) => {
        const isActive = active === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
              isActive
                ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
                : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/[0.16] hover:text-white/70'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
