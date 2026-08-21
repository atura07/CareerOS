import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Code2,
  Mic,
  Map,
  Briefcase,
  Building2,
  GitBranch,
  LogOut,
  X,
  ChevronLeft,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { CareerOSLogo } from '../common/CareerOSLogo'

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  path: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Resume', icon: FileText, path: '/dashboard/resume' },
  { label: 'Companies', icon: Building2, path: '/dashboard/companies' },
  { label: 'LeetCode', icon: Code2, path: '/dashboard/leetcode' },
  { label: 'GitHub', icon: GitBranch, path: '/dashboard/github' },
  { label: 'ATS Score', icon: BarChart3, path: '/dashboard/ats' },
  { label: 'DSA Tracker', icon: Code2, path: '/dashboard/dsa' },
  { label: 'Mock Interview', icon: Mic, path: '/dashboard/interview' },
  { label: 'Roadmap Generator', icon: Map, path: '/dashboard/roadmap' },
  { label: 'Applications', icon: Briefcase, path: '/dashboard/applications' },
  { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
]

interface SidebarProps {
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
}

export function Sidebar({ mobileOpen: controlledMobileOpen, setMobileOpen: controlledSetMobileOpen }: SidebarProps) {
  const [internalCollapsed, setCollapsed] = useState(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)

  const mobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen
  const setMobileOpen = controlledSetMobileOpen || setInternalMobileOpen

  const { logout, user } = useAuth()
  const location = useLocation()

  const renderSidebarNav = (isMobileDrawer: boolean = false) => (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
        <Link
          to="/dashboard"
          onClick={() => isMobileDrawer && setMobileOpen(false)}
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-lg"
        >
          <CareerOSLogo size={30} className="shrink-0 drop-shadow-md" />
          {(!internalCollapsed || isMobileDrawer) && (
            <span className="text-sm font-semibold tracking-tight text-white/90">
              CareerOS
            </span>
          )}
        </Link>
        {!isMobileDrawer ? (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 lg:inline-flex"
            aria-label={internalCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-200 ${internalCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        ) : (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobileDrawer && setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                isActive
                  ? 'bg-blue-500/14 text-blue-400 ring-1 ring-blue-500/20'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {(!internalCollapsed || isMobileDrawer) && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="border-t border-white/[0.06] px-3 py-4">
        {(!internalCollapsed || isMobileDrawer) && user && (
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white/80">
                {user.fullName}
              </p>
              <p className="truncate text-[11px] text-white/40">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            if (isMobileDrawer) setMobileOpen(false)
            logout()
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 transition-all duration-200 hover:bg-white/[0.04] hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!internalCollapsed || isMobileDrawer) && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden h-screen shrink-0 overflow-hidden border-r border-white/[0.06] bg-[#05070c] transition-all duration-300 lg:block ${
          internalCollapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {renderSidebarNav(false)}
      </aside>

      {/* Mobile Drawer (Slide-out) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] max-w-[85vw] overflow-hidden border-r border-white/[0.08] bg-[#070a12] shadow-2xl lg:hidden"
            >
              {renderSidebarNav(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
