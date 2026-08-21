import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Coins, ArrowUpRight, BookOpen, Briefcase } from 'lucide-react'
import type { CompanySummary } from '../../services/api'

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function CompanyCard({ company }: { company: CompanySummary }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] motion-reduce:transition-none"
    >
      {/* Industry badge */}
      {company.industry && (
        <div className="absolute right-3 top-3 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
          {company.industry}
        </div>
      )}

      {/* Logo + name */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-lg font-bold text-blue-400 ring-1 ring-blue-500/20 transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100">
          {company.logoUrl || company.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="truncate text-base font-semibold tracking-tight text-white/90">
            {company.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-white/40">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{company.location || 'Multiple Locations'}</span>
          </p>
        </div>
      </div>

      {/* Package + Roles & Topics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
            <Coins className="h-3 w-3" /> Package
          </p>
          <p className="mt-0.5 text-sm font-semibold text-emerald-400">
            {company.packageInfo || 'Competitive'}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
            <Briefcase className="h-3 w-3" /> Open Roles
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white/80">
            {company.rolesCount || 1} Positions
          </p>
        </div>
      </div>

      {/* Topics count info */}
      <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
        <BookOpen className="h-3.5 w-3.5 text-blue-400" />
        <span>{company.prepTopicsCount || 0} Company Preparation Topics</span>
      </div>

      {/* Difficulty + Hiring process */}
      <div className="mt-3 space-y-1 text-xs">
        <p className="text-white/40">
          Difficulty:{' '}
          <span
            className={`font-semibold ${
              DIFFICULTY_STYLES[company.difficulty] || 'text-amber-400'
            }`}
          >
            {company.difficulty}
          </span>
        </p>
        {company.processSummary && company.processSummary.length > 0 && (
          <p className="truncate text-white/40">
            Process:{' '}
            <span className="text-white/60">{company.processSummary.join(' → ')}</span>
          </p>
        )}
      </div>

      {/* View details */}
      <div className="mt-4 flex items-center justify-end border-t border-white/[0.04] pt-3">
        <Link
          to={`/dashboard/companies/${company.slug}`}
          className="inline-flex items-center gap-1 rounded-xl bg-blue-500/14 px-3 py-2 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          aria-label={`View preparation details for ${company.name}`}
        >
          Prepare Now <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}
