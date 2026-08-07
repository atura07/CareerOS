import { motion } from 'framer-motion'
import { History } from 'lucide-react'
import type { InterviewRecord } from '../../data/interview'

const RESULT_STYLES: Record<InterviewRecord['result'], string> = {
  Excellent: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
  Passed: 'border-blue-500/30 bg-blue-500/14 text-blue-400',
  'Needs Work': 'border-amber-500/30 bg-amber-500/14 text-amber-400',
}

interface InterviewHistoryProps {
  records: InterviewRecord[]
}

export function InterviewHistory({ records }: InterviewHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
          <History className="h-6 w-6 text-white/30" />
        </div>
        <p className="text-sm font-medium text-white/60">No interview history yet</p>
        <p className="mt-1 text-xs text-white/40">Complete an interview to see it here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur">
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold text-white/90">Interview History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-t border-white/[0.06] text-xs uppercase tracking-wide text-white/40">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Score</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-white/[0.04] transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3 font-medium text-white/80">{r.company}</td>
                <td className="px-5 py-3 text-white/60">{r.date}</td>
                <td className="px-5 py-3 text-white/70">{r.type}</td>
                <td className="px-5 py-3 font-semibold text-blue-400">{r.score}%</td>
                <td className="px-5 py-3 text-white/60">{r.duration} min</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${RESULT_STYLES[r.result]}`}
                  >
                    {r.result}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
