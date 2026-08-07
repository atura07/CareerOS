import { motion } from 'framer-motion'
import { ThumbsUp, AlertTriangle, Lightbulb } from 'lucide-react'
import type { Feedback } from '../../data/interview'

interface InterviewFeedbackProps {
  feedback: Feedback
}

function List({ icon, title, items, accent }: {
  icon: React.ReactNode
  title: string
  items: string[]
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur">
      <p className={`mb-3 flex items-center gap-2 text-sm font-semibold ${accent}`}>
        {icon}
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-white/60">
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${accent.replace('text-', 'bg-')}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InterviewFeedback({ feedback }: InterviewFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 text-sm font-semibold text-white/90">Feedback</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <List
          icon={<ThumbsUp className="h-4 w-4" />}
          title="Strengths"
          items={feedback.strengths}
          accent="text-emerald-400"
        />
        <List
          icon={<AlertTriangle className="h-4 w-4" />}
          title="Weaknesses"
          items={feedback.weaknesses}
          accent="text-amber-400"
        />
        <List
          icon={<Lightbulb className="h-4 w-4" />}
          title="Suggestions"
          items={feedback.suggestions}
          accent="text-blue-400"
        />
      </div>
    </motion.div>
  )
}
