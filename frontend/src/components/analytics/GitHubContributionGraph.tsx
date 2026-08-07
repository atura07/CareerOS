import { motion } from 'framer-motion'
import { GitCommitHorizontal } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function GitHubContributionGraph({ data }: { data: AnalyticsData }) {
  const points = data.githubContributions
  const max = Math.max(...points.map((p) => p.count))
  const width = 100
  const height = 60
  const stepX = width / (points.length - 1)
  const coords = points.map((p, i) => ({
    x: i * stepX,
    y: height - (p.count / max) * (height - 8) - 4,
  }))
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/14 ring-1 ring-emerald-500/20">
          <GitCommitHorizontal className="h-4 w-4 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">GitHub Contributions</h3>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="githubFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${linePath} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#githubFill)"
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        {coords.map((c, i) => (
          <motion.circle
            key={i}
            cx={c.x}
            cy={c.y}
            r="2"
            fill="#34d399"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          />
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-[11px] text-white/40">
        <span>{points[0].date}</span>
        <span>{points[points.length - 1].date}</span>
      </div>
    </div>
  )
}
