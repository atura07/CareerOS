import { motion } from 'framer-motion'
import { MapPin, Coins, CalendarDays, ArrowUpRight } from 'lucide-react'
import type { Application, Priority } from '../../data/applications'
import { StatusBadge } from './StatusBadge'

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'border-rose-500/30 bg-rose-500/14 text-rose-400',
  Medium: 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  Low: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

interface ApplicationCardProps {
  application: Application
  onViewDetails: (application: Application) => void
}

export function ApplicationCard({ application, onViewDetails }: ApplicationCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] motion-reduce:transition-none"
    >
      {/* Priority badge */}
      <div
        className={`absolute right-3 top-3 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[application.priority]}`}
      >
        {application.priority}
      </div>

      {/* Logo + company */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-lg font-bold text-blue-400 ring-1 ring-blue-500/20 transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100">
          {application.companyLogo}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight text-white/90">
            {application.companyName}
          </h3>
          <p className="flex items-center gap-1 text-xs text-white/40">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{application.location}</span>
          </p>
        </div>
      </div>

      {/* Role + package */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-white/40">Role</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white/80">{application.role}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
            <Coins className="h-3 w-3" /> Package
          </p>
          <p className="mt-0.5 text-sm font-semibold text-emerald-400">{application.package}</p>
        </div>
      </div>

      {/* Status + deadline */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusBadge status={application.status} />
        <span className="flex items-center gap-1 text-xs text-white/40">
          <CalendarDays className="h-3 w-3" />
          {application.deadline}
        </span>
      </div>

      {/* View details */}
      <div className="mt-4 flex items-center justify-end border-t border-white/[0.04] pt-3">
        <button
          onClick={() => onViewDetails(application)}
          className="inline-flex items-center gap-1 rounded-xl bg-blue-500/14 px-3 py-2 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          aria-label={`View details for ${application.companyName}`}
        >
          View Details <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
