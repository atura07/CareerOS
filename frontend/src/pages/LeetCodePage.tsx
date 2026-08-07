import { motion } from 'framer-motion'
import { Code2, RefreshCw, AlertTriangle, UserX } from 'lucide-react'
import {
  ProfileCard,
  StatsCards,
  DifficultyChart,
  RecentProblems,
  DailyChallenge,
  ContestCard,
  Heatmap,
} from '../components/leetcode'
import { useLeetCode } from '../hooks/useLeetCode'
import { LEETCODE_USERNAME } from '../services/leetcode'
import type { LeetCodeError } from '../types/leetcode'

/* ----------------------------- Loading skeletons ----------------------------- */

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03] ${className}`} />
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <SkeletonBlock className="h-48 lg:col-span-2" />
        <SkeletonBlock className="h-48 lg:col-span-3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <SkeletonBlock className="h-48" />
        <SkeletonBlock className="h-48" />
        <SkeletonBlock className="h-48" />
      </div>
      <SkeletonBlock className="h-64" />
    </div>
  )
}

/* -------------------------------- Error state -------------------------------- */

function ErrorState({ error, onRetry }: { error: LeetCodeError; onRetry: () => void }) {
  const icon =
    error.kind === 'not-found' ? (
      <UserX className="h-8 w-8 text-rose-400" />
    ) : (
      <AlertTriangle className="h-8 w-8 text-amber-400" />
    )

  const title =
    error.kind === 'not-found'
      ? `LeetCode user not found`
      : error.kind === 'rate-limited'
        ? 'LeetCode API rate limit reached'
        : 'Unable to load LeetCode data'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-16 text-center backdrop-blur"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white/80">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-white/40">{error.message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </motion.div>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export function LeetCodePage() {
  const { data, loading, error, retry } = useLeetCode()

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          <Code2 className="h-7 w-7 text-amber-400" />
          LeetCode Dashboard
        </div>
        <p className="mt-1 text-sm text-white/50">
          Live data for&nbsp;
          <span className="font-medium text-amber-400">@{LEETCODE_USERNAME}</span> — track your
          problem-solving progress, contests, and daily streaks.
        </p>
      </motion.div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : !data ? (
        <ErrorState
          error={{ kind: 'network', message: 'No LeetCode data available.' }}
          onRetry={retry}
        />
      ) : (
        <>
          {/* Profile + stats */}
          <div className="mb-6 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ProfileCard profile={data.profile} />
            </div>
            <div className="lg:col-span-3">
              <StatsCards stats={data.stats} />
            </div>
          </div>

          {/* Difficulty + Daily challenge + Contest */}
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <DifficultyChart stats={data.stats} />
            <DailyChallenge challenge={data.dailyChallenge} />
            <ContestCard contests={data.contestHistory} />
          </div>

          {/* Recent problems */}
          <div className="mb-6">
            <RecentProblems problems={data.recentProblems} />
          </div>

          {/* Heatmap */}
          <div>
            <Heatmap data={data.heatmap} />
          </div>
        </>
      )}
    </div>
  )
}
