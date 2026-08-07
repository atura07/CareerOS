import { motion } from 'framer-motion'
import { Mic, Sparkles } from 'lucide-react'

interface InterviewHeroProps {
  totalQuestions: number
  companies: number
}

export function InterviewHero({ totalQuestions, companies }: InterviewHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-blue-500/10 via-white/[0.03] to-indigo-500/10 p-6 backdrop-blur sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          Mock Interview
        </div>
        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          <Mic className="h-7 w-7 text-blue-400" />
          Mock Interview Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
          Practice realistic mock interviews across HR, Technical, System Design, and DSA.
          Choose a company, difficulty, and duration, then get instant scored feedback.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
            <span className="font-semibold text-white/80">{totalQuestions}</span> questions
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
            <span className="font-semibold text-white/80">{companies}</span> companies
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
            4 interview types
          </span>
        </div>
      </div>
    </motion.div>
  )
}
