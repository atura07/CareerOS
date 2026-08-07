import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function DSATrend({ data }: { data: AnalyticsData }) {
  const points = data.dsaTrend
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
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <Layers className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">DSA Progress Trend</h3>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dsaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${linePath} L ${width} ${height} L 0 ${height} Z`} fill="url(#dsaFill)" />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>

      <div className="mt-2 flex justify-between text-[11px] text-white/40">
        <span>{points[0].label}</span>
        <span className="font-semibold text-white/70">{points[points.length - 1].value}%</span>
      </div>
    </div>
  )
}
