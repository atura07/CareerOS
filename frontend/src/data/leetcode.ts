/**
 * LeetCode dashboard data.
 *
 * Types are centralized in `src/types/leetcode.ts`. Real profile data is now
 * fetched live from LeetCode's public GraphQL API (see `src/services/leetcode.ts`
 * and `src/hooks/useLeetCode.ts`).
 *
 * This module re-exports the shared types for the existing LeetCode components
 * (which import from `../../data/leetcode`) and provides the heatmap fallback
 * used when the submission calendar is unavailable.
 */
export type {
  ContestEntry,
  DailyChallenge,
  Difficulty,
  HeatmapDay,
  LeetCodeData,
  LeetCodeError,
  LeetCodeErrorKind,
  LeetCodeProfile,
  LeetCodeStats,
  ProblemStatus,
  RecentProblem,
} from '../types/leetcode'

import type { HeatmapDay } from '../types/leetcode'

// Deterministic placeholder submission calendar for the last 365 days.
// Used as a fallback when the user's submission calendar is not public.
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
