import { Search, Grid3x3, List, ArrowUpDown } from 'lucide-react'
import type { ViewMode, SortOption, ResumeTag } from './types'

interface ResumeToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  activeTags: string[]
  availableTags: ResumeTag[]
  onToggleTag: (tagId: string) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
]

function TagBadge({
  tag,
  isActive,
  onClick,
}: {
  tag: ResumeTag
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
        isActive
          ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
          : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/[0.16] hover:text-white/70'
      }`}
    >
      {tag.label}
    </button>
  )
}

export function ResumeToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  activeTags,
  availableTags,
  onToggleTag,
}: ResumeToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Search + View toggle + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white/80 placeholder-white/30 backdrop-blur transition-colors hover:border-white/[0.12] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-3 pr-8 text-sm text-white/60 backdrop-blur transition-colors hover:border-white/[0.12] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#05070c]">
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          </div>

          {/* View toggle */}
          <div className="flex overflow-hidden rounded-xl border border-white/[0.06]">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/60 ${
                viewMode === 'grid'
                  ? 'bg-blue-500/14 text-blue-400'
                  : 'bg-white/[0.03] text-white/40 hover:text-white/60'
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/60 ${
                viewMode === 'list'
                  ? 'bg-blue-500/14 text-blue-400'
                  : 'bg-white/[0.03] text-white/40 hover:text-white/60'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tags filter */}
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            isActive={activeTags.includes(tag.id)}
            onClick={() => onToggleTag(tag.id)}
          />
        ))}
        {activeTags.length > 0 && (
          <button
            onClick={() => onToggleTag('__clear__')}
            className="inline-flex items-center rounded-full border border-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/40 transition-colors hover:border-white/[0.12] hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}

