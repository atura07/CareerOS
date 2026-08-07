import { Building2 } from 'lucide-react'
import { MOCK_COMPANIES } from '../../data/interview'

interface CompanySelectorProps {
  value: string
  onChange: (company: string) => void
}

export function CompanySelector({ value, onChange }: CompanySelectorProps) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/50">
        <Building2 className="h-3.5 w-3.5" />
        Company
      </p>
      <div className="flex flex-wrap gap-2">
        {MOCK_COMPANIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.name)}
            className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
              value === c.name
                ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
                : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
