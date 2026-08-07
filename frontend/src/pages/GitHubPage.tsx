import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Search, AlertTriangle, GitBranch, FolderX } from 'lucide-react'
import {
  ProfileCard,
  StatsCards,
  ContributionGraph,
  RepositoryList,
  LanguageChart,
  ActivityTimeline,
  PinnedProjects,
  ContributionCalendar,
} from '../components/github'
import { useGitHub } from '../hooks/useGithub'
import { GITHUB_USERNAME } from '../services/github'
import type { GitHubError, Repository } from '../types/github'

/* ----------------------------- Loading skeletons ----------------------------- */

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03] ${className}`} />
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-40 w-full" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <SkeletonBlock className="h-48 lg:col-span-3" />
        <SkeletonBlock className="h-48 lg:col-span-2" />
      </div>
    </div>
  )
}

/* -------------------------------- Error state -------------------------------- */

function ErrorState({ error, onRetry }: { error: GitHubError; onRetry: () => void }) {
  const icon =
    error.kind === 'not-found' ? (
      <GitBranch className="h-8 w-8 text-rose-400" />
    ) : error.kind === 'rate-limited' ? (
      <AlertTriangle className="h-8 w-8 text-amber-400" />
    ) : (
      <AlertTriangle className="h-8 w-8 text-amber-400" />
    )

  const title =
    error.kind === 'not-found'
      ? 'GitHub user not found'
      : error.kind === 'rate-limited'
        ? 'GitHub API rate limit reached'
        : 'Unable to load GitHub data'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-16 text-center backdrop-blur"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white/80">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-white/40">{error.message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </motion.div>
  )
}

/* -------------------------------- Empty state -------------------------------- */

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
        <FolderX className="h-7 w-7 text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">No public repositories</h3>
      <p className="mt-1 max-w-sm text-sm text-white/40">
        This account has no public repositories to display yet.
      </p>
    </motion.div>
  )
}

/* ------------------------------ Search + filter ------------------------------ */

function RepoToolbar({
  query,
  onQueryChange,
  languages,
  activeLanguage,
  onLanguageChange,
}: {
  query: string
  onQueryChange: (q: string) => void
  languages: string[]
  activeLanguage: string
  onLanguageChange: (lang: string) => void
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white/80 placeholder-white/30 backdrop-blur transition-colors hover:border-white/[0.12] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onLanguageChange('All')}
          className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
            activeLanguage === 'All'
              ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
              : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/[0.16] hover:text-white/70'
          }`}
        >
          All
        </button>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
              activeLanguage === lang
                ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
                : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/[0.16] hover:text-white/70'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export function GitHubPage() {
  const { data, loading, error, retry } = useGitHub()
  const [query, setQuery] = useState('')
  const [activeLanguage, setActiveLanguage] = useState('All')

  const languages = useMemo(() => {
    if (!data) return []
    const langs = new Set(data.repositories.map((r) => r.language))
    return Array.from(langs).sort()
  }, [data])

  const filteredRepos: Repository[] = useMemo(() => {
    if (!data) return []
    return data.repositories.filter((repo) => {
      const matchesQuery =
        query.trim() === '' ||
        repo.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        (repo.description ?? '').toLowerCase().includes(query.trim().toLowerCase())
      const matchesLang = activeLanguage === 'All' || repo.language === activeLanguage
      return matchesQuery && matchesLang
    })
  }, [data, query, activeLanguage])

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          GitHub Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Live data for&nbsp;
          <span className="font-medium text-blue-400">@{GITHUB_USERNAME}</span> — track your
          open-source activity, repositories, and contributions.
        </p>
      </motion.div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : !data ? (
        <ErrorState
          error={{ kind: 'network', message: 'No GitHub data available.' }}
          onRetry={retry}
        />
      ) : (
        <div className="space-y-6">
          {/* Hero profile */}
          <ProfileCard profile={data.profile} />

          {/* Stats cards */}
          <StatsCards stats={data.stats} />

          {/* Contribution graph + activity */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContributionGraph data={data.contributionData} />
            </div>
            <div className="lg:col-span-2">
              <ActivityTimeline events={data.events} />
            </div>
          </div>

          {/* Pinned projects */}
          <PinnedProjects projects={data.pinned} />

          {/* Repository list */}
          <div>
            <RepoToolbar
              query={query}
              onQueryChange={setQuery}
              languages={languages}
              activeLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
            />
            {filteredRepos.length === 0 ? (
              <EmptyState />
            ) : (
              <RepositoryList repositories={filteredRepos} />
            )}
          </div>

          {/* Languages + contribution calendar */}
          <div className="grid gap-6 lg:grid-cols-2">
            <LanguageChart languages={data.languages} />
            <ContributionCalendar data={data.contributionData} />
          </div>
        </div>
      )}
    </div>
  )
}
