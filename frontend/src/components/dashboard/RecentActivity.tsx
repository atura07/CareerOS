import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Clock,
  FileText,
  Mic,
  Briefcase,
  Compass,
  Building2,
  Inbox,
  ArrowUpRight,
} from 'lucide-react'
import type { RecentActivityData } from '../../services/api/dashboardService'

interface RecentActivityProps {
  activities?: RecentActivityData[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'RESUME_UPLOAD':
        return <FileText className="h-4 w-4 text-blue-400" />
      case 'INTERVIEW_COMPLETED':
        return <Mic className="h-4 w-4 text-emerald-400" />
      case 'APPLICATION_ADDED':
        return <Briefcase className="h-4 w-4 text-sky-400" />
      case 'ROADMAP_GENERATED':
        return <Compass className="h-4 w-4 text-teal-400" />
      case 'PREP_TASK_COMPLETED':
        return <Building2 className="h-4 w-4 text-purple-400" />
      default:
        return <Clock className="h-4 w-4 text-white/50" />
    }
  }

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-bold tracking-tight text-white/90">Recent Activity</h2>
        </div>
        <span className="text-[11px] text-white/40">Real-time event feed</span>
      </div>

      {!activities || activities.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white/30 mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-xs font-semibold text-white/70">No activity yet</h3>
          <p className="mt-1 text-[11px] text-white/40 max-w-xs leading-relaxed">
            Your verified resume updates, mock interviews, and application changes will appear here
            as you progress.
          </p>
        </div>
      ) : (
        /* Real Activity List */
        <div className="space-y-3">
          {activities.map((act, idx) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 sm:p-3.5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  {getActivityIcon(act.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/90 truncate">{act.title}</p>
                  <p className="text-[11px] text-white/50 truncate">{act.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-white/40 font-medium whitespace-nowrap">
                  {act.relativeTime}
                </span>
                <Link
                  to={act.link}
                  className="text-white/30 group-hover:text-blue-400 transition-colors p-1"
                  aria-label="View activity detail"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
