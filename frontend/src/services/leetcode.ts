import type {
  HeatmapDay,
  LeetCodeData,
  LeetCodeError,
} from '../types/leetcode'
import { httpClient } from './api/httpClient'
import { ENDPOINTS } from './api/endpoints'

/** LeetCode username to load. Override via VITE_LEETCODE_USERNAME. */
export const LEETCODE_USERNAME: string =
  (import.meta.env.VITE_LEETCODE_USERNAME as string | undefined) ?? 'atul_yadav'

/** Session cache TTL (milliseconds). */
const CACHE_TTL = 5 * 60 * 1000

interface CacheEntry {
  data: LeetCodeData
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

/** Deterministic placeholder submission calendar (last 365 days). */
export function generateHeatmapData(): HeatmapDay[] {
  const days: HeatmapDay[] = []
  const today = new Date()
  for (let i = 364; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const iso = date.toISOString().slice(0, 10)
    const seed =
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    const count = (seed * 7 + 13) % 7
    days.push({ date: iso, count })
  }
  return days
}

/* ------------------------------ Data fetching ------------------------------ */

/**
 * Fetch live LeetCode data for the specified username via our backend API.
 * Eliminates direct browser GraphQL calls and CORS restrictions.
 * Caches the response for the session to avoid redundant network requests.
 */
export async function fetchLeetCodeData(username: string = LEETCODE_USERNAME): Promise<LeetCodeData> {
  const target = (username && username.trim().length > 0) ? username.trim() : LEETCODE_USERNAME
  const now = Date.now()
  const cached = cache.get(target.toLowerCase())
  if (cached && cached.expiresAt > now) {
    return cached.data
  }

  try {
    const endpoint = ENDPOINTS.LEETCODE(target)
    const response = await httpClient.get<LeetCodeData>(endpoint)
    const data = response.data

    if (!data || !data.profile) {
      throw new Error('not-found')
    }

    cache.set(target.toLowerCase(), { data, expiresAt: now + CACHE_TTL })
    return data
  } catch (err: unknown) {
    throw toError(err, target)
  }
}

/* ------------------------------ Error mapping ------------------------------ */

function toError(err: unknown, username: string): LeetCodeError {
  if (typeof err === 'object' && err !== null && 'kind' in err && 'message' in err) {
    return err as LeetCodeError
  }

  const axiosError = err as {
    response?: {
      status?: number
      data?: { message?: string; error?: string }
    }
    message?: string
  }

  const status = axiosError.response?.status
  const backendMsg = axiosError.response?.data?.message || axiosError.response?.data?.error

  if (status === 404 || axiosError.message === 'not-found') {
    return {
      kind: 'not-found',
      message: backendMsg || `LeetCode user "${username}" was not found.`,
    }
  }

  if (status === 429) {
    return {
      kind: 'rate-limited',
      message: 'LeetCode API rate limit reached. Please try again in a few minutes.',
    }
  }

  return {
    kind: 'network',
    message: backendMsg || axiosError.message || 'Unable to load LeetCode data from CareerOS backend.',
  }
}
