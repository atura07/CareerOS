import { useCallback, useEffect, useState } from 'react'

/**
 * Generic React hook for loading and refreshing data from a Supabase-backed
 * repository call. Returns data, loading, error, and a `refresh` callback.
 *
 * @example
 * const { data, isLoading, error, refresh } = useDatabase(queryFn)
 */
export function useDatabase<T>(
  queryFn: () => Promise<{ data: T | null; error: { message: string } | null }>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)

    queryFn()
      .then((result) => {
        if (!active) return
        setData(result.data)
        setError(result.error?.message ?? null)
      })
      .catch((err: unknown) => {
        if (!active) return
        setData(null)
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...deps])

  return { data, isLoading, error, refresh }
}
