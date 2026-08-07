import { motion } from 'framer-motion'
import { FileText, Zap, ListChecks, Briefcase } from 'lucide-react'
import type { ATSScore } from '../../data/ats'

const ICON_MAP = {
  file: FileText,
  zap: Zap,
  list: ListChecks,
  briefcase: Briefcase,
} as const

const COLOR_MAP: Record<string, string> = {
  'ATS Score': 'text-blue-400 bg-blue-500/14 ring-blue-500/20',
  'Resume Health': 'text-emerald-400 bg-emerald-500/14 ring-emerald-500/20',
  'Keyword Match': 'text-amber-400 bg-amber-500/14 ring-amber-500/20',
  'Recruiter Readability': 'text-violet-400 bg-violet-500/14 ring-violet-500/20',
}

const BAR_MAP: Record<string, string> = {
  'ATS Score': 'from-blue-500 to-indigo-400',
  'Resume Health': 'from-emerald-500 to-teal-400',
  'Keyword Match': 'from-amber-500 to-orange-400',
  'Recruiter Readability': 'from-violet-500 to-purple-400',
}

export function ATSScoreCards({ scores }: { scores: ATSScore[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {scores.map((item, i) => {
        const Icon = ICON_MAP[item.icon]
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${COLOR_MAP[item.label]}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-white/50">{item.label}</p>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-white/90">
              {item.score}
              <span className="text-sm font-normal text-white/40">/100</span>
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className={`h-full rounded-full bg-gradient-to-r ${BAR_MAP[item.label]}`}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
