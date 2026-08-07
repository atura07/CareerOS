import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import {
  ReadinessScore,
  KpiCards,
  WeeklyProgress,
  MonthlyProgress,
  GitHubContributionGraph,
  LeetCodeTrend,
  DSATrend,
  ATSTrend,
  InterviewPerformance,
  ApplicationStats,
  ResumeImprovementTrend,
  OverallHeatmap,
  AnalyticsEmptyState,
} from '../components/analytics'
import { ANALYTICS_DATA } from '../data/analytics'

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          <BarChart3 className="h-7 w-7 text-blue-400" />
          Placement Analytics
        </div>
        <p className="mt-1 text-sm text-white/50">
          Track your overall placement readiness, progress trends, and performance.
        </p>
      </motion.div>

      {/* Readiness + KPIs */}
      <div className="mb-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ReadinessScore data={ANALYTICS_DATA} />
        </div>
        <div className="lg:col-span-3">
          <KpiCards data={ANALYTICS_DATA} />
        </div>
      </div>

      {/* Weekly + Monthly */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <WeeklyProgress data={ANALYTICS_DATA} />
        <MonthlyProgress data={ANALYTICS_DATA} />
      </div>

      {/* Trends */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <GitHubContributionGraph data={ANALYTICS_DATA} />
        <LeetCodeTrend data={ANALYTICS_DATA} />
        <DSATrend data={ANALYTICS_DATA} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <ATSTrend data={ANALYTICS_DATA} />
        <InterviewPerformance data={ANALYTICS_DATA} />
        <ApplicationStats data={ANALYTICS_DATA} />
      </div>

      {/* Resume improvement + Heatmap */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ResumeImprovementTrend data={ANALYTICS_DATA} />
        <OverallHeatmap data={ANALYTICS_DATA} />
      </div>

      {/* Empty state */}
      <AnalyticsEmptyState />
    </div>
  )
}
