import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText,
  Sparkles,
  Mic,
  RotateCcw,
  Building2,
  Briefcase,
  Compass,
  Trophy,
  ArrowRight,
} from 'lucide-react'
import type { NextActionData } from '../../services/api/dashboardService'

interface NextActionsProps {
  actions?: NextActionData[]
}

export function NextActions({ actions }: NextActionsProps) {
  if (!actions || actions.length === 0) return null

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="h-5 w-5 text-blue-400" />
      case 'Sparkles':
        return <Sparkles className="h-5 w-5 text-purple-400" />
      case 'Mic':
        return <Mic className="h-5 w-5 text-emerald-400" />
      case 'RotateCcw':
        return <RotateCcw className="h-5 w-5 text-amber-400" />
      case 'Building2':
        return <Building2 className="h-5 w-5 text-sky-400" />
      case 'Briefcase':
        return <Briefcase className="h-5 w-5 text-indigo-400" />
      case 'Compass':
        return <Compass className="h-5 w-5 text-teal-400" />
      default:
        return <Trophy className="h-5 w-5 text-amber-400" />
    }
  }

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'HIGH':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-400'
      case 'MEDIUM':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
      default:
        return 'border-blue-500/30 bg-blue-500/10 text-blue-400'
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-white/90">
          What Should You Do Next?
        </h2>
        <p className="text-xs text-white/40">
          Recommended actions prioritized from your real placement journey
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((act, index) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.04]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  {getIcon(act.icon)}
                </div>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getPriorityStyle(
                    act.priority
                  )}`}
                >
                  {act.priority} PRIORITY
                </span>
              </div>

              <h3 className="mt-3.5 text-sm font-bold text-white/95">{act.title}</h3>
              <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{act.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.06]">
              <Link
                to={act.ctaLink}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 py-2.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all"
              >
                {act.ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
