import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText,
  Code2,
  Mic,
  GitBranch,
  Briefcase,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Unplug,
} from 'lucide-react'
import type { JourneyStatusData, JourneyCardStatus } from '../../services/api/dashboardService'

interface PlacementJourneyProps {
  journey?: JourneyStatusData
}

export function PlacementJourney({ journey }: PlacementJourneyProps) {
  if (!journey) return null

  const cards: { icon: typeof FileText; data: JourneyCardStatus; accent: string }[] = [
    {
      icon: FileText,
      data: journey.resume,
      accent: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
    },
    {
      icon: Code2,
      data: journey.dsa,
      accent: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
    },
    {
      icon: Mic,
      data: journey.mockInterview,
      accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      icon: GitBranch,
      data: journey.github,
      accent: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    },
    {
      icon: Briefcase,
      data: journey.applications,
      accent: 'from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30',
    },
  ]

  const getStatusPill = (data: JourneyCardStatus) => {
    if (data.key === 'github' && data.state === 'NOT_CONNECTED') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Unplug className="h-3 w-3" />
          {data.stateLabel}
        </span>
      )
    }

    if (data.isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          {data.stateLabel}
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border border-white/10 bg-white/[0.04] text-white/50">
        <CircleDashed className="h-3 w-3" />
        {data.stateLabel}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white/90">
            Placement Journey
          </h2>
          <p className="text-xs text-white/40">
            Live status across your core career preparation pillars
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ icon: Icon, data, accent }, idx) => {
          return (
            <motion.div
              key={data.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]"
            >
              <div>
                {/* Header: Icon + Status Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-gradient-to-br ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {getStatusPill(data)}
                </div>

                {/* Title & Primary Metric */}
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {data.title}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base font-bold text-white/95 truncate">
                    {data.primaryMetric}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50 line-clamp-1">{data.subtitle}</p>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-5 border-t border-white/[0.06] pt-3">
                <Link
                  to={data.ctaLink}
                  className="inline-flex w-full items-center justify-between text-xs font-semibold text-white/70 transition-colors group-hover:text-blue-400"
                >
                  <span>{data.ctaLabel}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
