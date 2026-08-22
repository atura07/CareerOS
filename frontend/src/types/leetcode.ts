export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type ProblemStatus = 'Solved' | 'Attempted' | 'Pending'

export interface LeetCodeProfile {
  username: string
  /** Rendered as a letter chip by ProfileCard. */
  avatar: string
  ranking: number
  contestRating: number
  globalRank: number
  countryRank: number
}

export interface LeetCodeStats {
  problemsSolved: number
  easy: number
  medium: number
  hard: number
  acceptanceRate: number
  submissions: number
  badges: number
  currentStreak: number
  longestStreak: number
  contestRating: number
}

export interface DailyChallenge {
  title: string
  difficulty: Difficulty
  status: ProblemStatus
}

export interface RecentProblem {
  id: number
  title: string
  titleSlug?: string
  url?: string
  difficulty: Difficulty
  status: ProblemStatus
  date: string
}

export interface ContestEntry {
  id: number
  name: string
  rating: number
  rank: number
  date: string
}

export interface HeatmapDay {
  date: string // ISO date
  count: number
}

export type LeetCodeErrorKind = 'not-found' | 'rate-limited' | 'network' | 'unauthorized' | 'unknown'

export interface LeetCodeError {
  kind: LeetCodeErrorKind
  message: string
}

export interface LeetCodeData {
  profile: LeetCodeProfile
  stats: LeetCodeStats
  dailyChallenge: DailyChallenge
  recentProblems: RecentProblem[]
  contestHistory: ContestEntry[]
  heatmap: HeatmapDay[]
}

export interface LeetCodePreviewResponse {
  valid: boolean
  username?: string
  avatar?: string
  ranking?: number
  problemsSolved?: number
  easy?: number
  medium?: number
  hard?: number
  contestRating?: number
  message?: string
}

export interface LeetCodeStatusResponse {
  connected: boolean
  username?: string | null
  lastSyncedAt?: string | null
  lastSyncStatus?: 'SUCCESS' | 'FAILED' | 'PENDING' | string | null
  lastErrorMessage?: string | null
  data?: LeetCodeData | null
}

export interface ConnectLeetCodePayload {
  username: string
}
