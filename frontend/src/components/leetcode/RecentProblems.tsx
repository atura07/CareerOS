import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, Code2 } from 'lucide-react'
import type { RecentProblem, Difficulty } from '../../types/leetcode'

const DIFFICULTY_STYLE: Record<Difficulty, { badge: string; text: string }> = {
  Easy: {
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    text: 'text-emerald-400',
  },
  Medium: {
    badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    text: 'text-amber-400',
  },
  Hard: {
    badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    text: 'text-rose-400',
  },
}

function getProblemUrl(problem: RecentProblem): string {
  if (problem.url) return problem.url
  const slug =
    problem.titleSlug ||
    problem.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  return `https://leetcode.com/problems/${slug}/`
}

export function RecentProblems({
  problems,
  selectedDifficulty,
}: {
  problems?: RecentProblem[] | null
  selectedDifficulty?: Difficulty | null
}) {
  const allProblems = problems || []
  const filteredProblems = selectedDifficulty
    ? allProblems.filter((p) => p.difficulty === selectedDifficulty)
    : allProblems

  return (
    <motion.div
      id="recent-problems-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/20">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white/90">
              Recent Solved Problems
            </h3>
            <p className="text-[11px] text-white/40">Latest accepted submissions on LeetCode</p>
          </div>
        </div>

        {selectedDifficulty && (
          <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/70">
            Showing {selectedDifficulty} only
          </span>
        )}
      </div>

      {filteredProblems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-white/40">
                <th className="pb-2.5 pl-1 pr-3 font-medium">Status</th>
                <th className="pb-2.5 pr-3 font-medium">Problem Title</th>
                <th className="pb-2.5 pr-3 font-medium">Difficulty</th>
                <th className="pb-2.5 pr-3 font-medium">Accepted Date</th>
                <th className="pb-2.5 pr-1 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredProblems.map((problem) => {
                const diffStyle = DIFFICULTY_STYLE[problem.difficulty] || DIFFICULTY_STYLE.Medium
                const problemUrl = getProblemUrl(problem)

                return (
                  <tr
                    key={problem.id}
                    className="group transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pl-1 pr-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Solved</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 font-medium text-white/85 transition group-hover:text-white">
                      {problem.title}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${diffStyle.badge}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-xs text-white/40">
                      {problem.date}
                    </td>
                    <td className="py-3 pr-1 text-right">
                      <a
                        href={problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-white/70 transition hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-300"
                      >
                        View Problem
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/40 ring-1 ring-white/[0.08]">
            <Code2 className="h-5 w-5 text-white/40" />
          </div>
          <h4 className="text-xs font-semibold text-white/80">No recent submissions found</h4>
          <p className="mt-0.5 text-[11px] text-white/40">
            {selectedDifficulty
              ? `No ${selectedDifficulty} problems in your recent submissions.`
              : 'Recent accepted problems will appear here once submitted on LeetCode.'}
          </p>
        </div>
      )}
    </motion.div>
  )
}
