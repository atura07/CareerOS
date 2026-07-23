import { useAuth } from '../../contexts/AuthContext'
import { Bell, Search } from 'lucide-react'

export function Topbar() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#05070c]/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Search (placeholder) */}
      <div className="relative ml-10 hidden w-full max-w-xs sm:block lg:ml-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          placeholder="Search..."
          readOnly
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-white/50 placeholder-white/30 backdrop-blur transition-colors hover:border-white/[0.12] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-white/40 transition-all hover:border-white/[0.12] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
        </button>

        {/* Profile avatar (mobile) */}
        <div className="flex items-center gap-3 lg:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
            {user?.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium text-white/80">{user?.fullName}</p>
            <p className="text-xs text-white/40">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

