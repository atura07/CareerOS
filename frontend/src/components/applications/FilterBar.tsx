import type { ApplicationStatus } from '../../data/applications'

export type FilterValue = ApplicationStatus | 'All'

export const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Wishlist', label: 'Wishlist' },
  { value: 'Applied', label: 'Applied' },
  { value: 'OA Scheduled', label: 'OA Scheduled' },
  { value: 'OA Cleared', label: 'OA Cleared' },
  { value: 'Technical Interview', label: 'Technical' },
  { value: 'HR Interview', label: 'HR' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
]

interface FilterBarProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
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
