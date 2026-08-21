import { motion } from 'framer-motion'
import type { SkillRadarItem } from '../../data/analytics'

interface SkillRadarChartProps {
  skills: SkillRadarItem[]
}

export function SkillRadarChart({ skills }: SkillRadarChartProps) {
  const size = 260
  const cx = size / 2
  const cy = size / 2
  const radius = 90

  const points = (values: number[]) =>
    values
      .map((v, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2
        const r = (v / 100) * radius
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
      })
      .join(' ')

  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-2 text-sm font-semibold text-white/90">Skill Radar</h3>
      <div className="relative mx-auto w-full max-w-[280px] aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          {/* Grid rings */}
          {gridLevels.map((level) => (
            <polygon
              key={level}
              points={points(skills.map(() => level * 100))}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}
          {/* Axis lines */}
          {skills.map((_, i) => {
            const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + radius * Math.cos(angle)}
                y2={cy + radius * Math.sin(angle)}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            )
          })}
          {/* Data area */}
          <polygon
            points={points(skills.map((s) => s.value))}
            fill="rgba(96,165,250,0.15)"
            stroke="rgba(96,165,250,0.9)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Data points */}
          {skills.map((s, i) => {
            const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
            const r = (s.value / 100) * radius
            const x = cx + r * Math.cos(angle)
            const y = cy + r * Math.sin(angle)
            return (
              <motion.circle
                key={s.skill}
                cx={x}
                cy={y}
                r="3.5"
                fill="#60a5fa"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              />
            )
          })}
        </svg>
        {/* Labels */}
        {skills.map((s, i) => {
          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
          const r = radius + 24
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          return (
            <div
              key={s.skill}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
              style={{ left: `${(x / size) * 100}%`, top: `${(y / size) * 100}%` }}
            >
              <p className="text-[10px] sm:text-[11px] font-medium text-white/70 whitespace-nowrap">
                {s.skill}
              </p>
              <p className="text-[9px] sm:text-[10px] text-white/40">{s.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
