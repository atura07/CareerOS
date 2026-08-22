import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, AlertCircle, Loader2, UserCheck, AlertTriangle } from 'lucide-react'
import type { LeetCodePreviewResponse } from '../../types/leetcode'

interface ManageConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  currentUsername: string | null
  lastSyncedAt: string | null
  onConnect: (username: string) => Promise<boolean>
  onDisconnect: () => Promise<boolean>
  onPreview: (username: string) => Promise<LeetCodePreviewResponse | null>
  previewData: LeetCodePreviewResponse | null
  previewLoading: boolean
  previewError: string | null
  connecting: boolean
}

export function ManageConnectionModal({
  isOpen,
  onClose,
  currentUsername,
  lastSyncedAt,
  onConnect,
  onDisconnect,
  onPreview,
  previewData,
  previewLoading,
  previewError,
  connecting,
}: ManageConnectionModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'change' | 'disconnect'>('info')
  const [newUsername, setNewUsername] = useState('')

  if (!isOpen) return null

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim() || previewLoading) return
    await onPreview(newUsername.trim())
  }

  const handleConfirmChange = async () => {
    if (!previewData?.username || connecting) return
    const success = await onConnect(previewData.username)
    if (success) {
      setActiveTab('info')
      setNewUsername('')
      onClose()
    }
  }

  const handleConfirmDisconnect = async () => {
    if (connecting) return
    const success = await onDisconnect()
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

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-500/30">
              <UserCheck className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white/95">
                Manage LeetCode Integration
              </h3>
              <p className="text-xs text-white/50">Manage your connected account settings</p>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="mt-6 flex gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                activeTab === 'info'
                  ? 'bg-white/[0.1] text-white shadow'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Account Info
            </button>
            <button
              onClick={() => setActiveTab('change')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                activeTab === 'change'
                  ? 'bg-white/[0.1] text-white shadow'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Change Username
            </button>
            <button
              onClick={() => setActiveTab('disconnect')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                activeTab === 'disconnect'
                  ? 'bg-rose-500/20 text-rose-300 shadow'
                  : 'text-white/50 hover:text-rose-300'
              }`}
            >
              Disconnect
            </button>
          </div>

          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 uppercase tracking-wide">Connected Account</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 font-bold text-amber-400">
                      {currentUsername ? currentUsername.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-white/90">@{currentUsername}</p>
                      <p className="text-[11px] text-emerald-400">Active & Syncing</p>
                    </div>
                  </div>
                  <a
                    href={`https://leetcode.com/${currentUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 transition hover:underline"
                  >
                    View on LeetCode ↗
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 uppercase tracking-wide">Last Sync Timestamp</p>
                <p className="mt-1 text-sm font-medium text-white/80">
                  {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Not synced yet'}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('change')}
                  className="flex-1 rounded-xl bg-white/[0.08] py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.14]"
                >
                  Change Username
                </button>
                <button
                  onClick={() => setActiveTab('disconnect')}
                  className="flex-1 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                >
                  Disconnect Account
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CHANGE USERNAME */}
          {activeTab === 'change' && (
            <div className="mt-6">
              <form onSubmit={handleSearch}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  New LeetCode Username
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username..."
                    className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 transition focus:border-amber-400/60 focus:bg-white/[0.07] focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!newUsername.trim() || previewLoading}
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
              </form>

              {previewError && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <span>{previewError}</span>
                </div>
              )}

              {previewData && previewData.valid && (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">@{previewData.username}</span>
                    <span className="text-xs text-emerald-400 font-medium">
                      {previewData.problemsSolved} Solved
                    </span>
                  </div>
                  <button
                    onClick={handleConfirmChange}
                    disabled={connecting}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2 text-xs font-semibold text-white transition hover:from-amber-400 hover:to-orange-400"
                  >
                    {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Switch to this Account'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISCONNECT */}
          {activeTab === 'disconnect' && (
            <div className="mt-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 ring-1 ring-rose-500/30">
                <AlertTriangle className="h-7 w-7 text-rose-400" />
              </div>
              <h4 className="mt-4 font-bold text-white/95">Disconnect LeetCode Account?</h4>
              <p className="mt-2 text-xs text-white/50 leading-relaxed">
                Disconnecting will remove your connected LeetCode profile from CareerOS. You can reconnect anytime.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setActiveTab('info')}
                  className="flex-1 rounded-xl bg-white/[0.08] py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.14]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDisconnect}
                  disabled={connecting}
                  className="flex-1 rounded-xl bg-rose-500 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
                >
                  {connecting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Confirm Disconnect'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
