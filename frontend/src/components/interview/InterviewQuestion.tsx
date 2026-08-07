import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb, CheckCircle2 } from 'lucide-react'
import type { InterviewQuestion as IQuestion } from '../../data/interview'

interface InterviewQuestionProps {
  questions: IQuestion[]
  currentIndex: number
  answered: boolean
  onPrev: () => void
  onNext: () => void
  onToggleAnswered: () => void
}

export function InterviewQuestion({
  questions,
  currentIndex,
  answered,
  onPrev,
  onNext,
  onToggleAnswered,
}: InterviewQuestionProps) {
  const question = questions[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-white/40">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-300">
          {question.company}
        </span>
      </div>

      <h3 className="text-lg font-semibold leading-relaxed text-white/90">
        {question.question}
      </h3>

      <div className="mt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-amber-300/80">
          <Lightbulb className="h-3.5 w-3.5" />
          Expected Topics
        </p>
        <div className="flex flex-wrap gap-1.5">
          {question.expectedTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/60"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        <button
          onClick={onToggleAnswered}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
            answered
              ? 'bg-emerald-500/14 text-emerald-400 ring-1 ring-emerald-500/20 hover:bg-emerald-500/25'
              : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          {answered ? 'Marked Answered' : 'Mark Answered'}
        </button>

        <button
          onClick={onNext}
          disabled={isLast}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/14 px-3 py-2 text-sm font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
