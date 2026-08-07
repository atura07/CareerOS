import { motion } from 'framer-motion'
import {
  Code2,
  Layout,
  Server,
  Layers,
  BarChart3,
  Bot,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import type { ATSProfile } from '../../data/ats'

const ICON_MAP = {
  code: Code2,
  layout: Layout,
  server: Server,
  layers: Layers,
  chart: BarChart3,
  bot: Bot,
} as const

const COLOR_MAP: Record<number, string> = {
  0: 'from-blue-500 to-indigo-400',
  1: 'from-emerald-500 to-teal-400',
  2: 'from-amber-500 to-orange-400',
  3: 'from-violet-500 to-purple-400',
  4: 'from-rose-500 to-red-400',
  5: 'from-cyan-500 to-sky-400',
}

export function IndustryProfiles({ profiles }: { profiles: ATSProfile[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-1 text-sm font-semibold tracking-wide text-white/70">
        Industry-Specific ATS Profiles
      </h3>
      <p className="mb-4 text-xs text-white/40">
        See how your resume scores across different target roles.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile, i) => {
          const Icon = ICON_MAP[profile.icon]
          const percent = Math.round((profile.matchedKeywords / profile.totalKeywords) * 100)
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-white/80">{profile.role}</span>
                </div>
                <span className="text-lg font-semibold text-white/90">{profile.score}</span>
              </div>

              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.score}%` }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  className={`h-full rounded-full bg-gradient-to-r ${COLOR_MAP[i % 6]}`}
                />
              </div>

              <p className="mb-2 text-[11px] text-white/40">
                Keyword match {percent}% ({profile.matchedKeywords}/{profile.totalKeywords})
              </p>

              <div className="space-y-1.5">
                {profile.strengths.map((s) => (
                  <p key={s} className="flex items-start gap-1.5 text-[11px] text-emerald-400">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                    {s}
                  </p>
                ))}
                {profile.gaps.map((g) => (
                  <p key={g} className="flex items-start gap-1.5 text-[11px] text-amber-400">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                    {g}
                  </p>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
