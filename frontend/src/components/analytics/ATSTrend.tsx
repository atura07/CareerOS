import { motion } from 'framer-motion'
import { FileCheck2 } from 'lucide-react'
import type { AnalyticsData } from '../../data/analytics'

export function ATSTrend({ data }: { data: AnalyticsData }) {
  const points = data.atsTrend
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
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/14 ring-1 ring-emerald-500/20">
          <FileCheck2 className="h-4 w-4 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">ATS Score Trend</h3>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="atsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${linePath} L ${width} ${height} L 0 ${height} Z`} fill="url(#atsFill)" />
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
      </svg>

      <div className="mt-2 flex items-center justify-between text-[11px] text-white/40">
        <div className="flex gap-2">
          {points.map((p) => (
            <span key={p.label}>{p.label}</span>
          ))}
        </div>
        <span className="font-semibold text-white/70">{points[points.length - 1].value}</span>
      </div>
    </div>
  )
}
