export interface GitHubProfile {
  username: string
  fullName: string
  avatar: string
  bio: string
  followers: number
  following: number
  publicRepos: number
  stars: number
  commits: number
  joinedDate: string
  location: string
  company: string
  website: string
}

export interface GitHubStats {
  repositories: number
  stars: number
  forks: number
  followers: number
  following: number
  commits: number
  pullRequests: number
  issues: number
  contributions: number
}

export interface PinnedRepo {
  id: number
  name: string
  description: string
  language: string
  stars: number
  forks: number
  lastUpdated: string
  topics: string[]
}

export interface Repository {
  id: number
  name: string
  description: string
  language: string
  stars: number
  forks: number
  lastUpdated: string
  topics: string[]
  htmlUrl: string
}

export interface LanguageUsage {
  name: string
  percentage: number
}

export interface ActivityEvent {
  id: string
  type: 'commit' | 'pull-request' | 'issue' | 'repo'
  title: string
  detail: string
  date: string
}

export interface ContributionDay {
  date: string // ISO
  count: number
}

/**
 * Error categories surfaced to the UI.
 * - not-found    → invalid / non-existent username
 * - rate-limited → GitHub API rate limit exceeded
 * - network      → offline / CORS / generic API failure
 */
export type GitHubErrorKind = 'not-found' | 'rate-limited' | 'network'

export interface GitHubError {
  kind: GitHubErrorKind
  message: string
}
