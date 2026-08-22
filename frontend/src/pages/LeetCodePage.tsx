import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  RefreshCw,
  AlertTriangle,
  Settings2,
  ExternalLink,
  Plus,
  AlertCircle,
} from 'lucide-react'
import {
  ProfileCard,
  StatsCards,
  DifficultyChart,
  RecentProblems,
  DailyChallenge,
  ContestCard,
  Heatmap,
  EmptyState,
  ConnectModal,
  ManageConnectionModal,
} from '../components/leetcode'
import { useLeetCode } from '../hooks/useLeetCode'
import type { LeetCodeError, Difficulty } from '../types/leetcode'

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-16 text-center backdrop-blur-xl"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
        <AlertTriangle className="h-8 w-8 text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-white/90">Unable to Load LeetCode Data</h3>
      <p className="mt-1 max-w-md text-sm text-white/50">{error.message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </motion.div>
  )
}

function formatLastSynced(timestamp?: string | null): string {
  if (!timestamp) return 'Never synced'
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000))
    if (diffSec < 60) return 'Synced just now'
    if (diffSec < 3600) return `Last synced ${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `Last synced ${Math.floor(diffSec / 3600)}h ago`
    const days = Math.floor(diffSec / 86400)
    return `Last synced ${days}d ago`
  } catch {
    return 'Recently'
  }
}

/* ---------------------------------- Page ---------------------------------- */

export function LeetCodePage() {
  const {
    connected,
    username,
    lastSyncedAt,
    lastSyncStatus,
    lastErrorMessage,
    data,
    loading,
    syncing,
    connecting,
    error,
    previewLoading,
    previewError,
    previewData,
    previewUser,
    connectUser,
    disconnectUser,
    syncNow,
    clearPreview,
    retry,
  } = useLeetCode()

  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [manageModalOpen, setManageModalOpen] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)

  const handleOpenConnect = () => {
    clearPreview()
    setConnectModalOpen(true)
  }

  const handleOpenManage = () => {
    clearPreview()
    setManageModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Modals */}
      <ConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onConnect={connectUser}
        onPreview={previewUser}
        previewData={previewData}
        previewLoading={previewLoading}
        previewError={previewError}
        connecting={connecting}
      />

      <ManageConnectionModal
        isOpen={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        currentUsername={username}
        lastSyncedAt={lastSyncedAt}
        onConnect={connectUser}
        onDisconnect={disconnectUser}
        onPreview={previewUser}
        previewData={previewData}
        previewLoading={previewLoading}
        previewError={previewError}
        connecting={connecting}
      />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">
            <Code2 className="h-7 w-7 text-amber-400" />
            LeetCode Dashboard
          </div>
          <p className="mt-1 text-sm text-white/50">
            {connected && username ? (
              <>
                Connected to{' '}
                <a
                  href={`https://leetcode.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:underline"
                >
                  @{username}
                  <ExternalLink className="h-3 w-3" />
                </a>{' '}
                — tracking your real-time problem progress & rankings.
              </>
            ) : (
              'Connect your personal LeetCode account to track algorithmic milestones and progress.'
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {connected ? (
            <>
              <div className="hidden text-right text-xs text-white/40 sm:block">
                <p className="text-white/70 font-medium">{formatLastSynced(lastSyncedAt)}</p>
              </div>

              <button
                onClick={syncNow}
                disabled={syncing}
                title="Sync latest LeetCode data"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs font-semibold text-white/90 shadow-sm transition hover:border-white/[0.16] hover:bg-white/[0.08] disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin text-amber-400' : 'text-white/70'}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>

              <button
                onClick={handleOpenManage}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs font-semibold text-white/90 shadow-sm transition hover:border-white/[0.16] hover:bg-white/[0.08]"
              >
                <Settings2 className="h-3.5 w-3.5 text-white/70" />
                Manage
              </button>
            </>
          ) : (
            <button
              onClick={handleOpenConnect}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400"
            >
              <Plus className="h-4 w-4" />
              Connect LeetCode
            </button>
          )}
        </div>
      </motion.div>

      {/* Sync Warning Banner if fallback cached data is served */}
      {connected && lastSyncStatus === 'FAILED' && data && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300 backdrop-blur"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              LeetCode API temporarily unreachable ({lastErrorMessage || 'timeout'}). Displaying last synced data ({formatLastSynced(lastSyncedAt)}).
            </span>
          </div>
          <button
            onClick={syncNow}
            disabled={syncing}
            className="shrink-0 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/30"
          >
            Retry Sync
          </button>
        </motion.div>
      )}

      {/* Content Rendering */}
      {loading ? (
        <LoadingState />
      ) : !connected ? (
        <EmptyState onConnectClick={handleOpenConnect} />
      ) : error && !data ? (
        <ErrorState error={error} onRetry={retry} />
      ) : data ? (
        <>
          {/* Profile + Stats */}
          <div className="mb-6 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ProfileCard profile={data.profile} />
            </div>
            <div className="lg:col-span-3">
              <StatsCards
                stats={data.stats}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
              />
            </div>
          </div>

          {/* Difficulty + Daily Challenge + Contest History */}
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <DifficultyChart stats={data.stats} />
            <DailyChallenge challenge={data.dailyChallenge} />
            <ContestCard contests={data.contestHistory} />
          </div>

          {/* Recent Accepted Problems */}
          <div className="mb-6">
            <RecentProblems
              problems={data.recentProblems}
              selectedDifficulty={selectedDifficulty}
            />
          </div>

          {/* Contribution Heatmap */}
          <div>
            <Heatmap data={data.heatmap} />
          </div>
        </>
      ) : (
        <EmptyState onConnectClick={handleOpenConnect} />
      )}
    </div>
  )
}
