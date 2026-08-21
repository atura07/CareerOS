import { useEffect, useState, useCallback } from 'react'
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import {
  DashboardHero,
  PlacementJourney,
  PlacementReadinessCard,
  NextActions,
  RecentActivity,
  ProfileCompletionCard,
  ConsistencyBanner,
} from '../components/dashboard'
import { dashboardService, type DashboardSummaryResponse } from '../services/api'

export function PlacementDashboardPage() {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const summary = await dashboardService.getSummary()
      setData(summary)
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to load dashboard data. Please verify your connection.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  if (loading && !data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center text-center">
        <Loader2 className="h-9 w-9 animate-spin text-blue-500 mb-3" />
        <p className="text-sm font-semibold text-white/80">Loading your placement workspace...</p>
        <p className="mt-1 text-xs text-white/40">Aggregating real data from your profile</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-white/90">Could not load dashboard</h2>
        <p className="mt-2 text-xs text-white/50 leading-relaxed">{error}</p>
        <button
          onClick={fetchSummary}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      {/* 1. Dynamic Greeting Hero */}
      <DashboardHero greeting={data?.greeting} profile={data?.profileCompletion} />

      {/* 2. Section 1: Placement Journey (5 Real Status Cards) */}
      <PlacementJourney journey={data?.journey} />

      {/* 3. Section 4: Placement Readiness (Honest Calculation or Not Enough Data) */}
      <PlacementReadinessCard readiness={data?.placementReadiness} />

      {/* 4. Section 2: What Should You Do Next? (Dynamic Priority Queue) */}
      <NextActions actions={data?.nextActions} />

      {/* 5. Section 3 & 5: Recent Activity + Profile Completion */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity activities={data?.recentActivity} />
        </div>
        <div className="lg:col-span-2">
          <ProfileCompletionCard profile={data?.profileCompletion} />
        </div>
      </div>

      {/* 6. Section 6: Consistency & Motivation Banner */}
      <ConsistencyBanner consistency={data?.consistency} />
    </div>
  )
}
