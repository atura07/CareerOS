import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import { ProgressRing } from './ProgressRing'
import type { PlacementStatCard } from '../../data/analytics'

interface InterviewCardProps {
  data: PlacementStatCard
}

export function InterviewCard({ data }: InterviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/14 ring-1 ring-cyan-500/20">
          <Mic className="h-4 w-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">{data.title}</h3>
          <p className="text-xs text-white/40">{data.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <ProgressRing
          value={data.score}
          size={84}
          stroke={8}
          label={`${data.score}`}
          sublabel="score"
          gradientId="interviewScoreGradient"
          colorFrom="#22d3ee"
          colorTo="#0ea5e9"
        />
        <div className="text-right">
          <p className="text-2xl font-semibold text-white/90">{data.value}</p>
          <p className="text-[11px] uppercase tracking-wide text-white/40">
            rating
          </p>
        </div>
      </div>
    </motion.div>
  )
}
