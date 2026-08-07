import type {
  ContestEntry,
  DailyChallenge,
  HeatmapDay,
  LeetCodeData,
  LeetCodeError,
  LeetCodeProfile,
  LeetCodeStats,
  RecentProblem,
} from '../types/leetcode'

/** LeetCode username to load. Override via VITE_LEETCODE_USERNAME. */
export const LEETCODE_USERNAME: string =
  (import.meta.env.VITE_LEETCODE_USERNAME as string | undefined) ?? 'careeros_dev'

/** LeetCode public GraphQL endpoint. */
const GRAPHQL_URL = 'https://leetcode.com/graphql'

/** Session cache TTL (milliseconds). */
const CACHE_TTL = 5 * 60 * 1000

interface CacheEntry {
  data: LeetCodeData
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

/* ------------------------------- Raw types ------------------------------- */

interface RawDifficultyCount {
  difficulty: 'Easy' | 'Medium' | 'Hard'
  count: number
}

interface RawMatchedUser {
  username?: string | null
  contestBadge?: { displayName?: string | null } | null
  submitStats?: {
    acSubmissionNum: RawDifficultyCount[]
    totalSubmissionNum: RawDifficultyCount[]
  } | null
  profile?: {
    userAvatar?: string | null
    ranking?: number | null
    realName?: string | null
  } | null
}

interface RawUserProfile {
  contestRanking?: {
    rating?: number | null
    globalRanking?: number | null
  } | null
  userContestRanking?: {
    rating?: number | null
    globalRanking?: number | null
  } | null
  userContestRankingHistory?: Array<{
    contest?: RawContest | null
    rating?: number | null
    ranking?: number | null
    totalParticipants?: number | null
  }> | null
  submissionCalendar?: string | null
  userProfileCalendar?: {
    activeYears?: number[] | null
    streak?: number | null
    totalActiveDays?: number | null
    submissionCalendar?: string | null
  } | null
  activeDailyCodingChallengeQuestion?: {
    date?: string | null
    question?: RawQuestion | null
  } | null
  matchedUser?: RawMatchedUser | null
}

interface RawSubmission {
  id?: string | null
  title?: string | null
  titleSlug?: string | null
  timestamp?: string | null
  statusDisplay?: string | null
  lang?: string | null
}

interface RawRecentAcSubmissionList {
  recentAcSubmissionList?: RawSubmission[] | null
}

interface RawQuestion {
  title?: string | null
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
}

interface RawContest {
  title?: string | null
  startTime?: string | null
}

interface RawGraphQLResponse<T> {
  data?: T | null
  errors?: Array<{ message?: string }>
}

/* ------------------------------ GraphQL query ------------------------------ */

const PROFILE_QUERY = `
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      username
      contestBadge { displayName }
      submitStats {
        acSubmissionNum { difficulty count }
        totalSubmissionNum { difficulty count }
      }
      profile {
        userAvatar
        ranking
        realName
      }
    }
    userProfileCalendar(username: $username) {
      streak
      activeYears
      totalActiveDays
      submissionCalendar
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
    }
    userContestRankingHistory(username: $username) {
      contest { title startTime }
      rating
      ranking
      totalParticipants
    }
    activeDailyCodingChallengeQuestion {
      date
      question {
        title
        difficulty
      }
    }
  }
`

const RECENT_AC_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`

/* ------------------------------ GraphQL client ------------------------------ */

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('rate-limited')
    }
    throw new Error(`HTTP ${res.status}`)
  }

  const json = (await res.json()) as RawGraphQLResponse<T>
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message ?? 'GraphQL error')
  }
  if (!json.data) {
    throw new Error('Empty GraphQL response')
  }
  return json.data
}

/* -------------------------------- Mappers -------------------------------- */

function toDifficulty(value: string | undefined | null): 'Easy' | 'Medium' | 'Hard' {
  if (value === 'Easy' || value === 'Medium' || value === 'Hard') return value
  return 'Medium'
}

function toProblemStatus(value: string | undefined | null): 'Solved' | 'Attempted' | 'Pending' {
  if (value === 'Solved' || value === 'Attempted' || value === 'Pending') return value
  return 'Pending'
}

function mapProfile(raw: RawUserProfile): LeetCodeProfile {
  const user = raw.matchedUser
  const profile = user?.profile
  const ranking = profile?.ranking ?? 0
  return {
    username: user?.username ?? LEETCODE_USERNAME,
    // ProfileCard renders {profile.avatar} as a letter chip to preserve the
    // existing UI. The real avatar URL is available via raw matchedUser.
    avatar: (user?.username ?? LEETCODE_USERNAME).charAt(0).toUpperCase(),
    ranking,
    contestRating: raw.userContestRanking?.rating ?? 0,
    globalRank: raw.userContestRanking?.globalRanking ?? ranking,
    countryRank: 0,
  }
}

function mapStats(raw: RawUserProfile): LeetCodeStats {
  const ac = raw.matchedUser?.submitStats?.acSubmissionNum ?? []
  const total = raw.matchedUser?.submitStats?.totalSubmissionNum ?? []
  const solved = ac.reduce((sum, item) => sum + item.count, 0)
  const submissions = total.reduce((sum, item) => sum + item.count, 0)
  const easy = ac.find((d) => d.difficulty === 'Easy')?.count ?? 0
  const medium = ac.find((d) => d.difficulty === 'Medium')?.count ?? 0
  const hard = ac.find((d) => d.difficulty === 'Hard')?.count ?? 0
const badgeName = raw.matchedUser?.contestBadge?.displayName
  const streak = raw.userProfileCalendar?.streak ?? 0

  return {
    problemsSolved: solved,
    easy,
    medium,
    hard,
    acceptanceRate: submissions > 0 ? Math.round((solved / submissions) * 100) : 0,
    submissions,
    badges: badgeName ? 1 : 0,
    currentStreak: streak,
    longestStreak: streak,
    contestRating: raw.userContestRanking?.rating ?? 0,
  }
}

function mapDailyChallenge(raw: RawUserProfile): DailyChallenge {
  const q = raw.activeDailyCodingChallengeQuestion?.question
  return {
    title: q?.title ?? 'No daily challenge available',
    difficulty: toDifficulty(q?.difficulty),
    status: 'Pending',
  }
}

function mapRecentProblems(raw: RawRecentAcSubmissionList): RecentProblem[] {
  const list = raw.recentAcSubmissionList ?? []
  return list.map((sub, index): RecentProblem => {
    const ts = Number(sub.timestamp ?? 0)
    const date = ts > 0
      ? new Date(ts * 1000).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
    return {
      id: Number(sub.id ?? 0) || index + 1,
      title: sub.title ?? 'Untitled problem',
      difficulty: 'Medium',
      status: toProblemStatus(sub.statusDisplay),
      date,
    }
  })
}

function mapContestHistory(raw: RawUserProfile): ContestEntry[] {
  const history = raw.userContestRankingHistory ?? []
  return history
    .filter((entry) => entry.contest && entry.rating != null && entry.rating > 0)
    .slice(0, 8)
    .map((entry, index): ContestEntry => ({
      id: index + 1,
      name: entry.contest?.title ?? 'Contest',
      rating: Math.round(entry.rating ?? 0),
      rank: entry.ranking ?? 0,
      date: entry.contest?.startTime
        ? new Date(Number(entry.contest.startTime) * 1000).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    }))
}

function mapHeatmap(raw: RawUserProfile): HeatmapDay[] {
  const calendar = raw.userProfileCalendar?.submissionCalendar
  if (calendar) {
    try {
      const parsed = JSON.parse(calendar) as Record<string, number>
      const days: HeatmapDay[] = []
      for (const [epoch, count] of Object.entries(parsed)) {
        const date = new Date(Number(epoch) * 1000).toISOString().slice(0, 10)
        days.push({ date, count })
      }
      return days.sort((a, b) => (a.date < b.date ? -1 : 1))
    } catch {
      return generateHeatmapData()
    }
  }
  return generateHeatmapData()
}

/** Deterministic placeholder submission calendar (last 365 days). */
export function generateHeatmapData(): HeatmapDay[] {
  const days: HeatmapDay[] = []
  const today = new Date()
  for (let i = 364; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const iso = date.toISOString()
    const seed =
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    const count = (seed * 7 + 13) % 7
    days.push({ date: iso, count })
  }
  return days
}

/* ------------------------------ Data fetching ------------------------------ */

/**
 * Fetch live LeetCode data for the configured username.
 * Caches the response for the session to avoid repeated GraphQL calls.
 */
export async function fetchLeetCodeData(username: string): Promise<LeetCodeData> {
  const now = Date.now()
  const cached = cache.get(username)
  if (cached && cached.expiresAt > now) {
    return cached.data
  }

  try {
    const profileRaw = await gql<RawUserProfile>(PROFILE_QUERY, { username })
    if (!profileRaw.matchedUser) {
      throw new Error('not-found')
    }

    const recentRaw = await gql<RawRecentAcSubmissionList>(RECENT_AC_QUERY, {
      username,
      limit: 20,
    })

    const data: LeetCodeData = {
      profile: mapProfile(profileRaw),
      stats: mapStats(profileRaw),
      dailyChallenge: mapDailyChallenge(profileRaw),
      recentProblems: mapRecentProblems(recentRaw),
      contestHistory: mapContestHistory(profileRaw),
      heatmap: mapHeatmap(profileRaw),
    }

    cache.set(username, { data, expiresAt: now + CACHE_TTL })
    return data
  } catch (err) {
    throw toError(err)
  }
}

/* ------------------------------ Error mapping ------------------------------ */

function toError(err: unknown): LeetCodeError {
  const message = err instanceof Error ? err.message : 'Unknown error'
  if (message === 'not-found') {
    return { kind: 'not-found', message: `LeetCode user "${LEETCODE_USERNAME}" was not found.` }
  }
  if (message === 'rate-limited') {
    return {
      kind: 'rate-limited',
      message: 'LeetCode API rate limit reached. Please try again in a few minutes.',
    }
  }
  if (message.startsWith('HTTP') || message.includes('fetch')) {
    return {
      kind: 'network',
      message:
        'Unable to reach the LeetCode API. This may be a network or CORS limitation. Data will fall back to placeholders.',
    }
  }
  return { kind: 'unknown', message }
}
