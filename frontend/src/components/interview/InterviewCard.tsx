import { motion } from 'framer-motion'
import { Clock, Rocket, Target } from 'lucide-react'
import type { InterviewType, Difficulty } from '../../data/interview'

const TYPE_META: Record<InterviewType, { label: string; icon: typeof Rocket; desc: string }> = {
  HR: { label: 'HR Interview', icon: Target, desc: 'Behavioral and situational questions to assess culture fit.' },
  Technical: { label: 'Technical Interview', icon: Rocket, desc: 'Core computer science and language fundamentals.' },
  'System Design': { label: 'System Design', icon: Rocket, desc: 'Architecture and scalability challenge walkthroughs.' },
  DSA: { label: 'DSA Interview', icon: Rocket, desc: 'Data structures and algorithms problem solving.' },
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

const TYPE_STYLES: Record<InterviewType, string> = {
  HR: 'from-emerald-500/30 to-teal-500/20 text-emerald-400 ring-emerald-500/20',
  Technical: 'from-blue-500/30 to-indigo-500/20 text-blue-400 ring-blue-500/20',
  'System Design': 'from-purple-500/30 to-pink-500/20 text-purple-400 ring-purple-500/20',
  DSA: 'from-amber-500/30 to-orange-500/20 text-amber-400 ring-amber-500/20',
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

interface InterviewCardProps {
  type: InterviewType
  difficulty: Difficulty
  onStart: (type: InterviewType) => void
}

export function InterviewCard({ type, difficulty, onStart }: InterviewCardProps) {
  const meta = TYPE_META[type]
  const Icon = meta.icon
  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] motion-reduce:transition-none"
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100 ${TYPE_STYLES[type]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight text-white/90">
            {meta.label}
          </h3>
          <p className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="h-3 w-3" /> 15–60 min
          </p>
        </div>
      </div>

      <p className="mb-4 flex-1 text-xs leading-relaxed text-white/50">{meta.desc}</p>

      <div className="mb-4 flex items-center gap-2 text-xs">
        <span className="text-white/40">Difficulty:</span>
        <span className={`font-semibold ${DIFFICULTY_STYLES[difficulty]}`}>{difficulty}</span>
      </div>

      <button
        onClick={() => onStart(type)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500/14 px-3 py-2.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        Start Interview
      </button>
    </motion.div>
  )
}
