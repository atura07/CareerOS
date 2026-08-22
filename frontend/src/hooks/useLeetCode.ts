import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  LeetCodeData,
  LeetCodeError,
  LeetCodePreviewResponse,
  LeetCodeStatusResponse,
} from '../types/leetcode'
import {
  connectLeetCodeAccount,
  disconnectLeetCodeAccount,
  getLeetCodeStatus,
  previewLeetCodeUser,
  syncLeetCodeAccount,
} from '../services/leetcode'

interface UseLeetCodeResult {
  connected: boolean
  username: string | null
  lastSyncedAt: string | null
  lastSyncStatus: string | null
  lastErrorMessage: string | null
  data: LeetCodeData | null
  loading: boolean
  syncing: boolean
  connecting: boolean
  error: LeetCodeError | null
  previewLoading: boolean
  previewError: string | null
  previewData: LeetCodePreviewResponse | null
  previewUser: (username: string) => Promise<LeetCodePreviewResponse | null>
  connectUser: (username: string) => Promise<boolean>
  disconnectUser: () => Promise<boolean>
  syncNow: () => Promise<void>
  clearPreview: () => void
  retry: () => void
}

/** Stale interval before triggering background sync (15 minutes). */
const STALE_SYNC_INTERVAL_MS = 15 * 60 * 1000

/**
 * Hook for managing the authenticated user's LeetCode connection, preview, sync, and dashboard data.
 */
export function useLeetCode(): UseLeetCodeResult {
  const [status, setStatus] = useState<LeetCodeStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<LeetCodeError | null>(null)

  // Track if background stale sync has been triggered for this session
  const autoSyncedRef = useRef(false)

  // Preview state for the modal
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<LeetCodePreviewResponse | null>(null)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getLeetCodeStatus()
      setStatus(res)

      // Automatic background sync if connected data is stale
      if (res.connected && !autoSyncedRef.current) {
        const lastSyncTime = res.lastSyncedAt ? new Date(res.lastSyncedAt).getTime() : 0
        const isStale = !lastSyncTime || Date.now() - lastSyncTime > STALE_SYNC_INTERVAL_MS
        if (isStale) {
          autoSyncedRef.current = true
          void (async () => {
            setSyncing(true)
            try {
              const freshRes = await syncLeetCodeAccount()
              setStatus(freshRes)
            } catch (syncErr) {
              console.debug('Background stale sync skipped:', syncErr)
            } finally {
              setSyncing(false)
            }
          })()
        }
      }
    } catch (err) {
      setError(err as LeetCodeError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  const previewUser = useCallback(async (username: string): Promise<LeetCodePreviewResponse | null> => {
    setPreviewLoading(true)
    setPreviewError(null)
    try {
      const preview = await previewLeetCodeUser(username)
      if (!preview.valid) {
        setPreviewError(preview.message || `User "${username}" was not found on LeetCode.`)
        setPreviewData(null)
        return preview
      }
      setPreviewData(preview)
      return preview
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to verify username on LeetCode.'
      setPreviewError(msg)
      setPreviewData(null)
      return null
    } finally {
      setPreviewLoading(false)
    }
  }, [])

  const connectUser = useCallback(async (username: string): Promise<boolean> => {
    setConnecting(true)
    setError(null)
    try {
      const res = await connectLeetCodeAccount(username)
      setStatus(res)
      setPreviewData(null)
      setPreviewError(null)
      autoSyncedRef.current = true
      return true
    } catch (err) {
      setError(err as LeetCodeError)
      return false
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnectUser = useCallback(async (): Promise<boolean> => {
    setConnecting(true)
    setError(null)
    try {
      await disconnectLeetCodeAccount()
      setStatus({
        connected: false,
        username: null,
        data: null,
        lastSyncedAt: null,
        lastSyncStatus: null,
      })
      autoSyncedRef.current = false
      return true
    } catch (err) {
      setError(err as LeetCodeError)
      return false
    } finally {
      setConnecting(false)
    }
  }, [])

  const syncNow = useCallback(async () => {
    if (syncing) return
    setSyncing(true)
    try {
      const res = await syncLeetCodeAccount()
      setStatus(res)
    } catch (err) {
      setError(err as LeetCodeError)
    } finally {
      setSyncing(false)
    }
  }, [syncing])

  const clearPreview = useCallback(() => {
    setPreviewData(null)
    setPreviewError(null)
  }, [])

  const retry = useCallback(() => {
    void loadStatus()
  }, [loadStatus])

  return {
    connected: status?.connected ?? false,
    username: status?.username ?? null,
    lastSyncedAt: status?.lastSyncedAt ?? null,
    lastSyncStatus: status?.lastSyncStatus ?? null,
    lastErrorMessage: status?.lastErrorMessage ?? null,
    data: status?.data ?? null,
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
  }
}
