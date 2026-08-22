import { motion } from 'framer-motion'
import { Code2, CheckCircle2, Zap, ArrowRight, ShieldCheck, Trophy, Flame } from 'lucide-react'

interface EmptyStateProps {
  onConnectClick: () => void
}

export function EmptyState({ onConnectClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent p-8 text-center backdrop-blur-xl sm:p-12"
    >
      {/* Background glow decorative effect */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      {/* Main icon badge */}
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 ring-1 ring-amber-500/30">
        <Code2 className="h-10 w-10 text-amber-400" />
      </div>

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
          <Zap className="h-3.5 w-3.5" /> Integration Ready
        </span>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white/95 sm:text-3xl">
          Connect Your LeetCode Account
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
          Track your real-time algorithmic problem solving, active streaks, contest rating history, and submission heatmap all seamlessly inside CareerOS.
        </p>

        {/* Feature highlights */}
        <div className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-white/85">Real-time Solved Stats</p>
              <p className="mt-0.5 text-[11px] text-white/40">Easy, Medium, and Hard problem breakdowns.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
            <div>
              <p className="text-xs font-semibold text-white/85">Activity Heatmap</p>
              <p className="mt-0.5 text-[11px] text-white/40">365-day submission calendar & active streak.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-white/85">Contest History</p>
              <p className="mt-0.5 text-[11px] text-white/40">Live global ranking & rating progression.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <div>
              <p className="text-xs font-semibold text-white/85">Zero Credentials Required</p>
              <p className="mt-0.5 text-[11px] text-white/40">Secure public handle connection only.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onConnectClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all duration-200 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:w-auto"
          >
            Connect LeetCode Account
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
