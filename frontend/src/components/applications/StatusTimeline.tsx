import { motion } from 'framer-motion'
import { CheckCircle2, Circle, XCircle } from 'lucide-react'
import type { ApplicationStatus } from '../../data/applications'

const FLOW: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'OA Scheduled',
  'OA Cleared',
  'Technical Interview',
  'HR Interview',
  'Offer',
]

interface StatusTimelineProps {
  status: ApplicationStatus
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  const currentIndex = FLOW.indexOf(status)
  const isRejected = status === 'Rejected'

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 text-sm font-semibold text-white/90">Placement Flow</h3>
      <ol className="relative ml-2 space-y-4 border-l border-white/[0.08] pl-5">
{FLOW.map((step, i) => {
          const isPassed = !isRejected && i < currentIndex
          const isCurrent = !isRejected && i === currentIndex
          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className={`flex items-center gap-3 text-sm ${
                isPassed
                  ? 'text-white/70'
                  : isCurrent
                    ? 'font-semibold text-blue-400'
                    : 'text-white/35'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : isCurrent ? (
                <Circle className="h-4 w-4 shrink-0 text-blue-400" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-white/20" />
              )}
              <span>{step}</span>
            </motion.li>
          )
        })}
        {/* Rejected branch */}
        <motion.li
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: FLOW.length * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className={`flex items-center gap-3 text-sm ${
            isRejected ? 'font-semibold text-rose-400' : 'text-white/35'
          }`}
        >
          {isRejected ? (
            <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-white/20" />
          )}
          <span>Rejected</span>
        </motion.li>
      </ol>
    </div>
  )
}
