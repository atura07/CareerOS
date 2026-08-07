import { Search } from 'lucide-react'

interface CompanySearchProps {
  query: string
  onQueryChange: (query: string) => void
}

export function CompanySearch({ query, onQueryChange }: CompanySearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
      <input
        type="text"
        placeholder="Search companies..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white/80 placeholder-white/30 backdrop-blur transition-colors hover:border-white/[0.12] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
      />
    </div>
  )
}
