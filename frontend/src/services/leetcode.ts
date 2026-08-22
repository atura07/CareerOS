import type {
  HeatmapDay,
  LeetCodeData,
  LeetCodeError,
  LeetCodePreviewResponse,
  LeetCodeStatusResponse,
} from '../types/leetcode'
import { httpClient } from './api/httpClient'
import { ENDPOINTS } from './api/endpoints'

/** Session cache TTL (milliseconds). */
const CACHE_TTL = 3 * 60 * 1000

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const statusCache = new Map<string, CacheEntry<LeetCodeStatusResponse>>()
const previewCache = new Map<string, CacheEntry<LeetCodePreviewResponse>>()

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

/* ------------------------------ API Services ------------------------------ */

/**
 * Get the current authenticated user's LeetCode connection status and synced data.
 */
export async function getLeetCodeStatus(): Promise<LeetCodeStatusResponse> {
  try {
    const response = await httpClient.get<LeetCodeStatusResponse>(ENDPOINTS.LEETCODE_STATUS)
    return response.data
  } catch (err: unknown) {
    throw toError(err, 'Failed to retrieve LeetCode connection status.')
  }
}

/**
 * Preview and validate a LeetCode username live before connecting.
 */
export async function previewLeetCodeUser(username: string): Promise<LeetCodePreviewResponse> {
  const clean = username.trim()
  if (!clean) {
    return { valid: false, message: 'Please enter a valid LeetCode username.' }
  }

  const cached = previewCache.get(clean.toLowerCase())
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  try {
    const response = await httpClient.post<LeetCodePreviewResponse>(ENDPOINTS.LEETCODE_PREVIEW, {
      username: clean,
    })
    const result = response.data
    previewCache.set(clean.toLowerCase(), { data: result, expiresAt: Date.now() + CACHE_TTL })
    return result
  } catch (err: unknown) {
    throw toError(err, `Failed to verify LeetCode username "${clean}".`)
  }
}

/**
 * Connect a LeetCode account for the authenticated user.
 */
export async function connectLeetCodeAccount(username: string): Promise<LeetCodeStatusResponse> {
  const clean = username.trim()
  try {
    const response = await httpClient.post<LeetCodeStatusResponse>(ENDPOINTS.LEETCODE_CONNECT, {
      username: clean,
    })
    statusCache.clear()
    return response.data
  } catch (err: unknown) {
    throw toError(err, `Failed to connect LeetCode account "${clean}".`)
  }
}

/**
 * Disconnect the authenticated user's LeetCode account.
 */
export async function disconnectLeetCodeAccount(): Promise<void> {
  try {
    await httpClient.delete(ENDPOINTS.LEETCODE_DISCONNECT)
    statusCache.clear()
  } catch (err: unknown) {
    throw toError(err, 'Failed to disconnect LeetCode account.')
  }
}

/**
 * Manually trigger a fresh data sync for the user's connected LeetCode account.
 */
export async function syncLeetCodeAccount(): Promise<LeetCodeStatusResponse> {
  try {
    const response = await httpClient.post<LeetCodeStatusResponse>(ENDPOINTS.LEETCODE_SYNC)
    statusCache.clear()
    return response.data
  } catch (err: unknown) {
    throw toError(err, 'Failed to sync LeetCode data.')
  }
}

/**
 * Fetch public LeetCode data for a specific username or current status.
 */
export async function fetchLeetCodeData(username?: string): Promise<LeetCodeData> {
  if (username && username.trim()) {
    const response = await httpClient.get<LeetCodeData>(ENDPOINTS.LEETCODE_PUBLIC(username.trim()))
    return response.data
  }
  const status = await getLeetCodeStatus()
  if (!status.connected || !status.data) {
    throw { kind: 'not-found', message: 'No connected LeetCode account found.' } as LeetCodeError
  }
  return status.data
}

/* ------------------------------ Error mapping ------------------------------ */

function toError(err: unknown, defaultMessage: string): LeetCodeError {
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

  if (status === 401 || status === 403) {
    return {
      kind: 'unauthorized',
      message: backendMsg || 'Please log in to manage your LeetCode integration.',
    }
  }

  if (status === 404) {
    return {
      kind: 'not-found',
      message: backendMsg || 'LeetCode profile was not found.',
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
    message: backendMsg || axiosError.message || defaultMessage,
  }
}
