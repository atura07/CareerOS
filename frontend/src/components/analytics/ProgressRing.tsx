import { motion } from 'framer-motion'

interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  label?: string
  sublabel?: string
  gradientId?: string
  colorFrom?: string
  colorTo?: string
}

export function ProgressRing({
  value,
  size = 128,
  stroke = 10,
  label,
  sublabel,
  gradientId = 'placementGradient',
  colorFrom = '#60a5fa',
  colorTo = '#818cf8',
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        {label !== undefined && (
          <p
            className="font-bold text-white/90"
            style={{ fontSize: size * 0.24 }}
          >
            {label}
          </p>
        )}
        {sublabel && (
          <p className="text-[10px] uppercase tracking-wide text-white/40">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  )
}
