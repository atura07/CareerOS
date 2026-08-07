import { motion } from 'framer-motion'
import { MessageSquare, Code2, ShieldCheck, Lightbulb, Trophy } from 'lucide-react'
import type { InterviewScore } from '../../data/interview'

interface InterviewScoreProps {
  score: InterviewScore
}

const ROWS: {
  key: keyof InterviewScore
  label: string
  icon: typeof MessageSquare
  color: string
}[] = [
  { key: 'communication', label: 'Communication', icon: MessageSquare, color: 'text-blue-400' },
  { key: 'technical', label: 'Technical', icon: Code2, color: 'text-purple-400' },
  { key: 'confidence', label: 'Confidence', icon: ShieldCheck, color: 'text-emerald-400' },
  { key: 'problemSolving', label: 'Problem Solving', icon: Lightbulb, color: 'text-amber-400' },
]

export function InterviewScore({ score }: InterviewScoreProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">Score Breakdown</h3>
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
          Overall
        </div>
      </div>

      <div className="mb-6 flex items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 56}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - score.overall / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className="text-3xl font-bold text-white/90">{score.overall}</p>
            <p className="text-[10px] uppercase tracking-wide text-white/40">/ 100</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {ROWS.map((row) => {
          const Icon = row.icon
          const value = score[row.key]
          return (
            <div key={row.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-white/60">
                  <Icon className={`h-3.5 w-3.5 ${row.color}`} />
                  {row.label}
                </span>
                <span className="font-semibold text-white/80">{value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className={`h-full rounded-full ${row.color.replace('text-', 'bg-')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
