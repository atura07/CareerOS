import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function LeetCodeTrend({ data }: { data: AnalyticsData }) {
  const points = data.leetCodeTrend
  const max = 100
  const width = 100
  const height = 60
  const stepX = width / (points.length - 1)
  const coords = points.map((p, i) => ({
    x: i * stepX,
    y: height - (p.value / max) * (height - 8) - 4,
  }))
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/14 ring-1 ring-amber-500/20">
          <Code2 className="h-4 w-4 text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">LeetCode Solved Trend</h3>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lcFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${linePath} L ${width} ${height} L 0 ${height} Z`} fill="url(#lcFill)" />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>

      <div className="mt-2 flex justify-between text-[11px] text-white/40">
        <span>{points[0].label}</span>
        <span className="font-semibold text-white/70">{points[points.length - 1].value} solved</span>
      </div>
    </div>
  )
}
