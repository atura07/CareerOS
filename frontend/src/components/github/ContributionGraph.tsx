import { motion } from 'framer-motion'
import { GitCommitHorizontal } from 'lucide-react'
import type { ContributionDay } from '../../data/github'

interface ContributionGraphProps {
  data: ContributionDay[]
}

const WEEKS = 52

export function ContributionGraph({ data }: ContributionGraphProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  const colorFor = (count: number) => {
    if (count === 0) return 'bg-white/[0.04]'
    const ratio = count / max
    if (ratio < 0.25) return 'bg-blue-500/30'
    if (ratio < 0.5) return 'bg-blue-500/50'
    if (ratio < 0.75) return 'bg-blue-500/70'
    return 'bg-blue-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center gap-2">
        <GitCommitHorizontal className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white/80">Contribution Graph</h3>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {Array.from({ length: Math.min(WEEKS, Math.ceil(data.length / 7)) }).map(
          (_, week) => (
            <div key={week} className="flex shrink-0 flex-col gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const idx = week * 7 + day
                const dayData = data[idx]
                if (!dayData) return <div key={day} className="h-3 w-3 rounded-[3px]" />
                return (
                  <div
                    key={day}
                    title={`${dayData.count} contributions`}
                    className={`h-3 w-3 rounded-[3px] ${colorFor(dayData.count)}`}
                  />
                )
              })}
            </div>
          ),
        )}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-white/30">
        Less
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-[3px] ${
              i === 0 ? 'bg-white/[0.04]' : i === 1 ? 'bg-blue-500/30' : i === 2 ? 'bg-blue-500/50' : i === 3 ? 'bg-blue-500/70' : 'bg-blue-400'
            }`}
          />
        ))}
        More
      </div>
    </motion.div>
  )
}
