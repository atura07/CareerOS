import { motion } from 'framer-motion'
import { CheckCircle2, Clock } from 'lucide-react'

interface SolvedVsPendingProps {
  solved: number
  pending: number
}

export function SolvedVsPending({ solved, pending }: SolvedVsPendingProps) {
  const total = solved + pending
  const solvedPercent = total > 0 ? Math.round((solved / total) * 100) : 0
  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 text-sm font-semibold text-white/90">Solved vs Pending</h3>

      <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${solvedPercent}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="h-full bg-emerald-400"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pendingPercent}%` }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="h-full bg-white/[0.15]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Solved
          </div>
          <p className="text-xl font-semibold text-white/90">{solved}</p>
          <p className="text-xs text-white/40">{solvedPercent}%</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-white/50">
            <Clock className="h-3.5 w-3.5" /> Pending
          </div>
          <p className="text-xl font-semibold text-white/90">{pending}</p>
          <p className="text-xs text-white/40">{pendingPercent}%</p>
        </div>
      </div>
    </div>
  )
}
