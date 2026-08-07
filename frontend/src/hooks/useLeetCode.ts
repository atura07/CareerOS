import { useCallback, useEffect, useState } from 'react'
import type { LeetCodeData, LeetCodeError } from '../types/leetcode'
import { fetchLeetCodeData, LEETCODE_USERNAME } from '../services/leetcode'

interface UseLeetCodeResult {
  data: LeetCodeData | null
  loading: boolean
  error: LeetCodeError | null
  retry: () => void
}

/**
 * Loads live LeetCode data for the configured username.
 * Exposes loading / error / data / retry state to the UI.
 */
export function useLeetCode(): UseLeetCodeResult {
  const [data, setData] = useState<LeetCodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<LeetCodeError | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchLeetCodeData(LEETCODE_USERNAME)
      setData(result)
    } catch (err) {
      setError(err as LeetCodeError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const retry = useCallback(() => {
    void load()
  }, [load])

  return { data, loading, error, retry }
}
