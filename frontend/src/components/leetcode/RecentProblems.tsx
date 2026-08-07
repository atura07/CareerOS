import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import type { RecentProblem, ProblemStatus } from '../../data/leetcode'

const STATUS_ICON: Record<ProblemStatus, React.ReactNode> = {
  Solved: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  Attempted: <Circle className="h-4 w-4 text-amber-400" />,
  Pending: <Clock className="h-4 w-4 text-white/30" />,
}

const DIFFICULTY_COLOR: Record<RecentProblem['difficulty'], string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

export function RecentProblems({ problems }: { problems: RecentProblem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <h3 className="mb-4 text-sm font-semibold tracking-tight text-white/90">
        Recent Problems
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wide text-white/40">
              <th className="pb-2 pr-3 font-medium">Status</th>
              <th className="pb-2 pr-3 font-medium">Title</th>
              <th className="pb-2 pr-3 font-medium">Difficulty</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr
                key={problem.id}
                className="border-b border-white/[0.03] last:border-0"
              >
                <td className="py-2.5 pr-3">{STATUS_ICON[problem.status]}</td>
                <td className="py-2.5 pr-3 text-white/70">{problem.title}</td>
                <td className={`py-2.5 pr-3 text-xs font-medium ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                  {problem.difficulty}
                </td>
                <td className="py-2.5 text-xs text-white/40">{problem.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
