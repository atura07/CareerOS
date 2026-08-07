import type {
  ActivityEvent,
  GitHubError,
  GitHubProfile,
  GitHubStats,
  LanguageUsage,
  Repository,
} from '../types/github'

/**
 * GitHub public REST API client.
 *
 * No authentication required. All GitHub API logic is isolated here so the
 * UI/hooks layer never talks to the network directly.
 */

export const GITHUB_API_BASE = 'https://api.github.com'

/** Configurable username for the dashboard (single source of truth). */
export const GITHUB_USERNAME = 'torvalds'

interface RawUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
  created_at: string
  location: string | null
  company: string | null
  blog: string | null
}

interface RawRepo {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  html_url: string
  topics: string[]
}

interface RawEvent {
  id: string
  type: string
  created_at: string
  payload: { commits?: { message: string }[]; pull_request?: { title: string }; issue?: { title: string } }
  repo?: { name: string }
}

/** In-memory session cache keyed by username to avoid redundant API calls. */
const cache = new Map<string, unknown>()

function cacheGet<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined
}

function cacheSet<T>(key: string, value: T): void {
  cache.set(key, value)
}

async function request<T>(path: string): Promise<T> {
  const cached = cacheGet<T>(path)
  if (cached) return cached

  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (res.status === 404) {
    const err: GitHubError = {
      kind: 'not-found',
      message: `We couldn't find a GitHub account for "${path.split('/')[2] ?? ''}". Check the username and try again.`,
    }
    throw err
  }

  if (res.status === 403 || res.status === 429) {
    const err: GitHubError = {
      kind: 'rate-limited',
      message:
        'GitHub API rate limit reached. Please wait a bit and try again, or check your available quota.',
    }
    throw err
  }

  if (!res.ok) {
    const err: GitHubError = {
      kind: 'network',
      message: `GitHub API request failed (${res.status}). Please check your connection and retry.`,
    }
    throw err
  }

  cacheSet(path, await res.json())
  return cacheGet<T>(path) as T
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function mapProfile(raw: RawUser): GitHubProfile {
  return {
    username: raw.login,
    fullName: raw.name ?? raw.login,
    // The existing ProfileCard renders {profile.avatar} as a letter chip, so we
    // pass the username initial to preserve the UI. The real avatar URL is
    // still exposed via raw.avatar_url should a future component need it.
    avatar: (raw.login.charAt(0) || 'G').toUpperCase(),
    bio: raw.bio ?? 'No bio provided.',
    followers: raw.followers,
    following: raw.following,
    publicRepos: raw.public_repos,
    stars: 0, // computed from repositories
    commits: 0, // not available via REST without auth
    joinedDate: formatDate(raw.created_at),
    location: raw.location ?? 'Not specified',
    company: raw.company ?? 'Independent',
    website: raw.blog ?? '—',
  }
}

function mapRepo(raw: RawRepo): Repository {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? 'No description provided.',
    language: raw.language ?? 'Unknown',
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    lastUpdated: formatDate(raw.updated_at),
    topics: Array.isArray(raw.topics) ? raw.topics : [],
    htmlUrl: raw.html_url,
  }
}

function aggregateLanguages(repos: Repository[]): LanguageUsage[] {
  const counts = new Map<string, number>()
  let total = 0
  for (const repo of repos) {
    const lang = repo.language === 'Unknown' ? 'Other' : repo.language
    counts.set(lang, (counts.get(lang) ?? 0) + 1)
    total += 1
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage)
}

function mapEvent(raw: RawEvent): ActivityEvent {
  const repoName = raw.repo?.name ?? 'unknown'
  let type: ActivityEvent['type'] = 'commit'
  let title = 'Repository activity'
  let detail = repoName

  if (raw.type === 'PushEvent') {
    const msg = raw.payload?.commits?.[0]?.message ?? 'New commit'
    type = 'commit'
    title = msg
    detail = repoName
  } else if (raw.type === 'PullRequestEvent') {
    type = 'pull-request'
    title = raw.payload?.pull_request?.title ?? 'Pull request'
    detail = repoName
  } else if (raw.type === 'IssuesEvent') {
    type = 'issue'
    title = raw.payload?.issue?.title ?? 'Issue'
    detail = repoName
  } else if (raw.type === 'CreateEvent' || raw.type === 'ForkEvent') {
    type = 'repo'
    title = raw.type === 'ForkEvent' ? `Forked ${repoName}` : `Created ${repoName}`
    detail = repoName
  }

  return {
    id: raw.id,
    type,
    title,
    detail,
    date: formatDate(raw.created_at),
  }
}

export async function fetchGitHubUser(username: string): Promise<GitHubProfile> {
  const raw = await request<RawUser>(`/users/${username}`)
  return mapProfile(raw)
}

export async function fetchGitHubRepositories(username: string): Promise<Repository[]> {
  const raw = await request<RawRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`)
  return raw.map(mapRepo)
}

export async function fetchGitHubEvents(username: string): Promise<ActivityEvent[]> {
  const raw = await request<RawEvent[]>(`/users/${username}/events/public?per_page=20`)
  return raw.map(mapEvent)
}

export function buildGitHubStats(repos: Repository[], profile: GitHubProfile): GitHubStats {
  const stars = repos.reduce((sum, r) => sum + r.stars, 0)
  const forks = repos.reduce((sum, r) => sum + r.forks, 0)
  return {
    repositories: repos.length,
    stars,
    forks,
    followers: profile.followers,
    following: profile.following,
    commits: profile.commits,
    pullRequests: 0,
    issues: 0,
    contributions: 0,
  }
}

export function buildLanguages(repos: Repository[]): LanguageUsage[] {
  return aggregateLanguages(repos)
}

export function buildPinned(repos: Repository[]): Repository[] {
  return [...repos].sort((a, b) => b.stars - a.stars).slice(0, 6)
}

export function clearGitHubCache(): void {
  cache.clear()
}
