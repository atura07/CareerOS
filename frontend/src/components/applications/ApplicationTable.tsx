import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import type { Application, Priority } from '../../data/applications'
import { StatusBadge } from './StatusBadge'

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'border-rose-500/30 bg-rose-500/14 text-rose-400',
  Medium: 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  Low: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

interface ApplicationTableProps {
  applications: Application[]
  onViewDetails: (application: Application) => void
}

export function ApplicationTable({ applications, onViewDetails }: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wide text-white/40">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Package</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Applied Date</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <motion.tr
              key={application.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="group border-b border-white/[0.04] transition-colors last:border-b-0 hover:bg-white/[0.03]"
            >
              {/* Company */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-sm font-bold text-blue-400 ring-1 ring-blue-500/20">
                    {application.companyLogo}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white/90">{application.companyName}</p>
                    <p className="truncate text-xs text-white/40">{application.location}</p>
                  </div>
                </div>
              </td>
              {/* Role */}
              <td className="max-w-[180px] px-4 py-3">
                <p className="truncate text-white/70">{application.role}</p>
              </td>
              {/* Package */}
              <td className="px-4 py-3 font-medium text-emerald-400">{application.package}</td>
              {/* Status */}
              <td className="px-4 py-3">
                <StatusBadge status={application.status} />
              </td>
              {/* Applied Date */}
              <td className="whitespace-nowrap px-4 py-3 text-white/50">{application.appliedDate}</td>
              {/* Deadline */}
              <td className="whitespace-nowrap px-4 py-3 text-white/50">{application.deadline}</td>
              {/* Priority */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[application.priority]}`}
                >
                  {application.priority}
                </span>
              </td>
              {/* Action */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <a
                    href={application.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                    aria-label={`Open application link for ${application.companyName}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => onViewDetails(application)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-500/14 px-2.5 py-1.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                    aria-label={`View details for ${application.companyName}`}
                  >
                    Details <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
