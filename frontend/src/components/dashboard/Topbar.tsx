import { useAuth } from '../../contexts/AuthContext'
import { Bell, Search, Menu } from 'lucide-react'
import { CareerOSLogo } from '../common/CareerOSLogo'

interface TopbarProps {
  onOpenMobileSidebar?: () => void
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#05070c]/85 px-3.5 backdrop-blur-xl sm:px-6">
      {/* Left side: Mobile Menu Trigger + Brand (mobile) + Desktop Search */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            aria-label="Open navigation sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2 lg:hidden">
          <CareerOSLogo size={24} className="shrink-0 drop-shadow-md" />
          <span className="text-sm font-semibold tracking-tight text-white/90">CareerOS</span>
        </div>

        {/* Search (desktop/tablet) */}
        <div className="relative hidden w-full max-w-xs sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            placeholder="Search CareerOS..."
            readOnly
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-4 text-xs sm:text-sm text-white/50 placeholder-white/30 backdrop-blur transition-colors hover:border-white/[0.12] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/50 transition-all hover:border-white/[0.12] hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
        </button>

        {/* Profile Avatar & Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/30">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden text-right lg:block max-w-[160px]">
            <p className="truncate text-xs font-semibold text-white/90">{user?.fullName || 'User'}</p>
            <p className="truncate text-[11px] text-white/40">{user?.email || 'user@careeros.ai'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
