/**
 * GitHub dashboard data.
 *
 * Types are centralized in `src/types/github.ts`. Real profile/repository data
 * is now fetched live from the GitHub REST API (see `src/services/github.ts`
 * and `src/hooks/useGithub.ts`).
 *
 * This module re-exports the shared types for the existing GitHub components
 * (which import from `../../data/github`) and provides the contribution
 * placeholder data used by the contribution graph/calendar until GitHub
 * GraphQL integration is available (REST has no contribution endpoint).
 */
import type { ContributionDay } from '../types/github'

export type {
  ActivityEvent,
  ContributionDay,
  GitHubError,
  GitHubErrorKind,
  GitHubProfile,
  GitHubStats,
  LanguageUsage,
  PinnedRepo,
  Repository,
} from '../types/github'

// Deterministic pseudo-random contribution data for the last 365 days.
// Placeholder only — replaced by real contribution data once GraphQL is added.
export function generateContributionData(): ContributionDay[] {
  const days: ContributionDay[] = []
  const today = new Date()
  for (let i = 364; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const seed =
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    const count = (seed * 11 + 5) % 9
    days.push({ date: date.toISOString(), count })
  }
  return days
}
