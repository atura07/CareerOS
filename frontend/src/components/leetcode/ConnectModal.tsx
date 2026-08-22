import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, CheckCircle2, AlertCircle, Loader2, ArrowRight, Trophy, Code2 } from 'lucide-react'
import type { LeetCodePreviewResponse } from '../../types/leetcode'

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (username: string) => Promise<boolean>
  onPreview: (username: string) => Promise<LeetCodePreviewResponse | null>
  previewData: LeetCodePreviewResponse | null
  previewLoading: boolean
  previewError: string | null
  connecting: boolean
}

export function ConnectModal({
  isOpen,
  onClose,
  onConnect,
  onPreview,
  previewData,
  previewLoading,
  previewError,
  connecting,
}: ConnectModalProps) {
  const [username, setUsername] = useState('')

  if (!isOpen) return null

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || previewLoading) return
    await onPreview(username.trim())
  }

  const handleConfirm = async () => {
    if (!previewData?.username || connecting) return
    const success = await onConnect(previewData.username)
    if (success) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.1] bg-[#12141a] p-6 text-white shadow-2xl sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-white/40 transition hover:bg-white/[0.08] hover:text-white/80"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/30">
              <Code2 className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white/95">
                Connect LeetCode Profile
              </h3>
              <p className="text-xs text-white/50">Enter your public handle to sync your stats</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
              LeetCode Username
            </label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. your_leetcode_username"
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 transition focus:border-amber-400/60 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-amber-400/60"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!username.trim() || previewLoading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.14] disabled:opacity-40"
              >
                {previewLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Verify
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-white/40">
              Your profile must be publicly viewable on leetcode.com/username
            </p>
          </form>

          {/* Error message */}
          {previewError && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <span>{previewError}</span>
            </motion.div>
          )}

          {/* Profile Preview Card */}
          {previewData && previewData.valid && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-lg font-bold text-amber-400 ring-1 ring-amber-500/30">
                    {previewData.avatar || previewData.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white/95">@{previewData.username}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-white/50">Verified LeetCode Profile</p>
                  </div>
                </div>

                {previewData.contestRating && previewData.contestRating > 0 ? (
                  <div className="flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                    <Trophy className="h-3.5 w-3.5" />
                    {previewData.contestRating}
                  </div>
                ) : null}
              </div>

              {/* Stats Chips */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2">
                  <p className="text-[10px] uppercase text-white/40">Total</p>
                  <p className="mt-0.5 font-bold text-white/90">{previewData.problemsSolved ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2">
                  <p className="text-[10px] uppercase text-emerald-400">Easy</p>
                  <p className="mt-0.5 font-bold text-emerald-400">{previewData.easy ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2">
                  <p className="text-[10px] uppercase text-amber-400">Medium</p>
                  <p className="mt-0.5 font-bold text-amber-400">{previewData.medium ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2">
                  <p className="text-[10px] uppercase text-rose-400">Hard</p>
                  <p className="mt-0.5 font-bold text-rose-400">{previewData.hard ?? 0}</p>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={connecting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400 disabled:opacity-50"
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Footer note */}
          <div className="mt-5 border-t border-white/[0.06] pt-4 text-center text-[11px] text-white/35">
            CareerOS only reads public metrics and never requests your LeetCode password or session cookies.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
