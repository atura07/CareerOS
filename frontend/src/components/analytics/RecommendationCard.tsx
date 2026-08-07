import { motion } from 'framer-motion'
import {
  FileText,
  FolderGit2,
  GitBranch,
  Code2,
  Mic,
  Map,
} from 'lucide-react'
import type { Recommendation } from '../../data/analytics'

interface RecommendationCardProps {
  recommendations: Recommendation[]
}

const ICONS: Record<string, typeof FileText> = {
  FileText,
  FolderGit2,
  GitBranch,
  Code2,
  Mic,
  Map,
}

const PRIORITY_STYLES = {
  high: 'bg-rose-500/14 text-rose-400 ring-rose-500/20',
  medium: 'bg-amber-500/14 text-amber-400 ring-amber-500/20',
  low: 'bg-white/[0.04] text-white/50 ring-white/[0.08]',
}

export function RecommendationCard({
  recommendations,
}: RecommendationCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">
          AI Recommendations
        </h3>
        <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40 ring-1 ring-white/[0.08]">
          Mock
        </span>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec, i) => {
          const Icon = ICONS[rec.icon] ?? FileText
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors duration-200 hover:bg-white/[0.05]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08]">
                <Icon className={`h-4 w-4 ${rec.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white/85">
                    {rec.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ring-1 ${PRIORITY_STYLES[rec.priority]}`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  {rec.description}
                </p>
                <p className="mt-1 text-[11px] font-medium text-emerald-400/80">
                  Impact: {rec.impact}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
