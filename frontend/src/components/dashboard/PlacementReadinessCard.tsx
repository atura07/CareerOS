import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  AlertCircle,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  FileText,
  Mic,
  Building2,
  Briefcase,
  Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PlacementReadinessData } from '../../services/api/dashboardService'

interface PlacementReadinessCardProps {
  readiness?: PlacementReadinessData
}

export function PlacementReadinessCard({ readiness }: PlacementReadinessCardProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  if (!readiness) return null

  const isAvailable = readiness.available && readiness.score !== null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INTERVIEW_READY':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
      case 'DEVELOPING':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-400'
      case 'BUILDING_MOMENTUM':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
      default:
        return 'border-purple-500/30 bg-purple-500/10 text-purple-400'
    }
  }

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="h-4 w-4 text-blue-400" />
      case 'Mic':
        return <Mic className="h-4 w-4 text-emerald-400" />
      case 'Building2':
        return <Building2 className="h-4 w-4 text-purple-400" />
      case 'Briefcase':
        return <Briefcase className="h-4 w-4 text-sky-400" />
      default:
        return <Target className="h-4 w-4 text-amber-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-7"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side: title + message or score breakdown */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white/95">
                Placement Readiness
              </h2>
            </div>
            {isAvailable && (
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                  readiness.status
                )}`}
              >
                {readiness.statusLabel}
              </span>
            )}
          </div>

          {!isAvailable ? (
            /* STATE A: INSUFFICIENT DATA (HONEST ZERO-DATA STATE) */
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/05 p-4 text-xs text-blue-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
                <p className="leading-relaxed text-white/80">
                  <span className="font-semibold text-white">Not enough data yet: </span>
                  {readiness.message}
                </p>
              </div>

              {readiness.requiredMilestones && readiness.requiredMilestones.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/60 mb-2">
                    Activities required to unlock your readiness score:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {readiness.requiredMilestones.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70"
                      >
                        <Target className="h-3.5 w-3.5 text-blue-400" />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STATE B: REAL CALCULATED READINESS */
            <div className="mt-4 space-y-4">
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-2xl">
                {readiness.message}
              </p>

              {/* 3 Real Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {readiness.strongestArea && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/05 p-3.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" /> Strongest Area
                    </span>
                    <p className="mt-1 text-xs font-semibold text-white/90">
                      {readiness.strongestArea}
                    </p>
                  </div>
                )}

                {readiness.areaNeedingAttention && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/05 p-3.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      <AlertCircle className="h-3.5 w-3.5" /> Focus Area
                    </span>
                    <p className="mt-1 text-xs font-semibold text-white/90">
                      {readiness.areaNeedingAttention}
                    </p>
                  </div>
                )}

                {readiness.recommendedNextAction && (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/05 p-3.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      <Sparkles className="h-3.5 w-3.5" /> Recommended Next
                    </span>
                    <p className="mt-1 text-xs font-semibold text-white/90">
                      {readiness.recommendedNextAction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* How this score is calculated toggle button */}
          <div className="mt-4 pt-2">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-blue-400 transition-colors"
              aria-expanded={showExplanation}
            >
              <Info className="h-3.5 w-3.5" />
              <span>How this score is calculated</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  showExplanation ? 'rotate-180 text-blue-400' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right side: Score representation or Unlock Card */}
        <div className="shrink-0 w-full lg:w-auto">
          {isAvailable ? (
            <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 rounded-3xl border border-white/[0.08] bg-black/40 p-6 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-blue-400">
                  {readiness.score}
                  <span className="text-base text-white/40">/100</span>
                </div>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Overall Score
                </span>
              </div>
              <Link
                to="/dashboard/interview"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500"
              >
                Boost Score <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-black/30 p-6 text-center min-w-[220px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-white/40">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="text-xs font-semibold text-white/70">
                {readiness.completedMilestonesCount} of {readiness.totalMilestonesCount}{' '}
                {readiness.totalMilestonesCount === 1 ? 'Milestone' : 'Milestones'}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${
                      (readiness.completedMilestonesCount / readiness.totalMilestonesCount) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Score Explainability Breakdown */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-5 border-t border-white/[0.06] pt-5 overflow-hidden"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">
                  Data-Driven Scoring Formula
                </h4>
                <span className="text-[11px] text-white/40">100 Pts Maximum</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                CareerOS calculates your placement readiness from genuine verified milestones across 4 core pillars without simulated points:
              </p>

              {readiness.breakdown && readiness.breakdown.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {readiness.breakdown.map((cat) => (
                    <div
                      key={cat.category}
                      className="flex flex-col justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {getCategoryIcon(cat.icon)}
                            <span className="text-xs font-semibold text-white/90">
                              {cat.category}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-blue-400">
                            {cat.earnedScore}/{cat.maxScore}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 leading-normal">{cat.statusText}</p>
                      </div>
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: `${Math.min(100, (cat.earnedScore / cat.maxScore) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <span className="font-semibold text-white/90">Resume & ATS (25%)</span>
                    <p className="text-white/50 text-[11px] mt-1">Evaluates keyword density & formatting score</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <span className="font-semibold text-white/90">Mock Interview (35%)</span>
                    <p className="text-white/50 text-[11px] mt-1">Evaluates conversational answers & problem-solving</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <span className="font-semibold text-white/90">Company Prep (20%)</span>
                    <p className="text-white/50 text-[11px] mt-1">Evaluates mastered topic coverage & study roadmaps</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <span className="font-semibold text-white/90">Job Pipeline (20%)</span>
                    <p className="text-white/50 text-[11px] mt-1">Evaluates active applications, OAs & interview rounds</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
