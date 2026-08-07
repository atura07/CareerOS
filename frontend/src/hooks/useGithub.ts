import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  ActivityEvent,
  ContributionDay,
  GitHubError,
  GitHubProfile,
  GitHubStats,
  LanguageUsage,
  Repository,
} from '../types/github'
import {
  buildGitHubStats,
  buildLanguages,
  buildPinned,
  fetchGitHubEvents,
  fetchGitHubRepositories,
  fetchGitHubUser,
  GITHUB_USERNAME,
} from '../services/github'
import { generateContributionData } from '../data/github'

export interface GitHubDashboardData {
  profile: GitHubProfile
  stats: GitHubStats
  repositories: Repository[]
  languages: LanguageUsage[]
  pinned: Repository[]
  events: ActivityEvent[]
  contributionData: ContributionDay[]
}

interface UseGitHubResult {
  data: GitHubDashboardData | null
  loading: boolean
  error: GitHubError | null
  retry: () => void
}

/**
 * Fetches a GitHub user's public profile data via the REST API.
 * Owns all fetch state (loading / error / retry) and caches results in the
 * service layer so repeated visits don't re-hit the network.
 *
 * The contribution graph/calendar continue to use mock placeholder data until
 * GitHub GraphQL integration is available (REST has no contribution endpoint).
 */
export function useGitHub(username: string = GITHUB_USERNAME): UseGitHubResult {
  const [data, setData] = useState<GitHubDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<GitHubError | null>(null)
  const [attempt, setAttempt] = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    try {
      // The service layer uses its own in-memory cache; we still guard against
      // unmounts via the signal.
      const profile = await fetchGitHubUser(username)
      const repositories = await fetchGitHubRepositories(username)
      const events = await fetchGitHubEvents(username)

      if (controller.signal.aborted) return

      const stats = buildGitHubStats(repositories, profile)
      const languages = buildLanguages(repositories)
      const pinned = buildPinned(repositories)

      setData({
        profile,
        stats,
        repositories,
        languages,
        pinned,
        events,
        contributionData: generateContributionData(),
      })
    } catch (err) {
      if (controller.signal.aborted) return
      if (err instanceof Error && 'kind' in err) {
        setError(err as GitHubError)
      } else {
        setError({
          kind: 'network',
          message: 'Something went wrong while fetching GitHub data. Please try again.',
        })
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [username])

  const retry = useCallback(() => {
    setAttempt((a) => a + 1)
  }, [])

  useEffect(() => {
    void load()
    return () => abortRef.current?.abort()
  }, [load, attempt])

  return { data, loading, error, retry }
}
