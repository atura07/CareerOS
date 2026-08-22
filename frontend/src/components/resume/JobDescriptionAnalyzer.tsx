import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Briefcase,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronDown,
  Building2,
  Code2,
  Layers,
  Search,
  Check,
  Plus,
} from 'lucide-react'
import type { ResumeFile } from './types'
import { getOverallAts, analyzeJobMatch } from '../../services/api'
import type { AtsDetailedResponse } from '../../services/api'

interface JobDescriptionAnalyzerProps {
  resume: ResumeFile | null
}

function ScoreRing({ score, size = 110 }: { score: number; size?: number }) {
  const radius = size * 0.4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference

  const color =
    score >= 85 ? '#3b82f6' :
    score >= 75 ? '#10b981' :
    score >= 60 ? '#f59e0b' :
    score >= 40 ? '#f97316' :
                  '#ef4444'

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white/95">
          {score}
        </span>
        <span className="text-[10px] uppercase font-bold text-white/40">/ 100</span>
      </div>
    </div>
  )
}

export function JobDescriptionAnalyzer({ resume }: JobDescriptionAnalyzerProps) {
  const [mode, setMode] = useState<'OVERALL' | 'JOB_MATCH'>('OVERALL')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [activeJobTab, setActiveJobTab] = useState<'OVERVIEW' | 'MATCHED' | 'MISSING' | 'KEYWORDS' | 'SUGGESTIONS'>('OVERVIEW')

  const [loadingOverall, setLoadingOverall] = useState(false)
  const [loadingJobMatch, setLoadingJobMatch] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [overallData, setOverallData] = useState<AtsDetailedResponse | null>(null)
  const [jobMatchData, setJobMatchData] = useState<AtsDetailedResponse | null>(null)
  const [showFormula, setShowFormula] = useState(false)

  // Fetch overall ATS whenever selected resume changes
  useEffect(() => {
    if (!resume || !resume.id) {
      setOverallData(null)
      setJobMatchData(null)
      return
    }

    let isMounted = true
    setLoadingOverall(true)
    setError(null)

    getOverallAts(Number(resume.id))
      .then((data) => {
        if (isMounted) setOverallData(data)
      })
      .catch((err) => {
        if (isMounted) {
          logError(err)
        }
      })
      .finally(() => {
        if (isMounted) setLoadingOverall(false)
      })

    return () => {
      isMounted = false
    }
  }, [resume?.id])

  const logError = (err: unknown) => {
    const msg = err && typeof err === 'object' && 'response' in err
      ? (err as { response: { data?: { message?: string; error?: string } } }).response?.data?.message
      : undefined
    setError(msg || 'Could not load ATS analysis. Please try again.')
  }

  const handleAnalyzeJobMatch = async () => {
    if (!resume || !jobDescription.trim()) return

    setLoadingJobMatch(true)
    setError(null)

    try {
      const data = await analyzeJobMatch(Number(resume.id), {
        jobTitle: jobTitle.trim() || undefined,
        companyName: companyName.trim() || undefined,
        jobDescription: jobDescription.trim(),
      })
      setJobMatchData(data)
      setActiveJobTab('OVERVIEW')
    } catch (err: unknown) {
      logError(err)
    } finally {
      setLoadingJobMatch(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl sm:p-6"
    >
      {/* ── Mode Selection Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-white/95">
              Hybrid ATS Analyzer
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-white/50">
            {mode === 'OVERALL'
              ? 'Deterministic evaluation across 6 core ATS criteria.'
              : 'Targeted keyword & skill match against specific Job Description.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex rounded-2xl border border-white/[0.08] bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setMode('OVERALL')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === 'OVERALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Overall ATS
          </button>
          <button
            type="button"
            onClick={() => setMode('JOB_MATCH')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === 'JOB_MATCH'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" /> Match a Job
          </button>
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white text-xs">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!resume ? (
        <div className="py-12 text-center text-xs text-white/40">
          Select or upload a resume from the library to view ATS insights.
        </div>
      ) : mode === 'OVERALL' ? (
        /* ════════════════ MODE 1: OVERALL ATS READINESS ════════════════ */
        <div className="mt-5 space-y-5">
          {loadingOverall ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/50 text-xs">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              <span>Analyzing resume structure and technical keywords...</span>
            </div>
          ) : overallData ? (
            <>
              {/* Score Hero Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-white/[0.08] bg-black/30 p-5">
                <div className="flex items-center gap-4">
                  <ScoreRing score={overallData.overallScore} />
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400">
                      <Sparkles className="h-3 w-3" /> {overallData.readinessLevel}
                    </span>
                    <h3 className="mt-1.5 text-sm sm:text-base font-bold text-white/90">
                      Overall ATS Readiness
                    </h3>
                    <p className="mt-0.5 text-xs text-white/50 leading-relaxed max-w-sm">
                      {overallData.summary}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFormula(!showFormula)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>How is this calculated?</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showFormula ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expandable Scoring Formula Breakdown */}
              <AnimatePresence>
                {showFormula && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-white/60 space-y-2"
                  >
                    <p className="font-semibold text-white/90">Deterministic ATS Scoring Formula (100 Pts):</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/60 pt-1">
                      <li>• <strong className="text-white/80">Completeness (20 pts):</strong> Contact info, summary, education, experience, projects, links.</li>
                      <li>• <strong className="text-white/80">Parsability (15 pts):</strong> Standard headers, clean UTF-8 text, logical reading order.</li>
                      <li>• <strong className="text-white/80">Skill Coverage (20 pts):</strong> Verified count across programming, web, databases, and tools.</li>
                      <li>• <strong className="text-white/80">Project Quality (20 pts):</strong> Action verbs, tech stacks, complexity, and live GitHub links.</li>
                      <li>• <strong className="text-white/80">Impact (15 pts):</strong> Quantified metrics (%, users, latency), awards, and certifications.</li>
                      <li>• <strong className="text-white/80">Language (10 pts):</strong> Action-oriented bullets, concise phrasing, zero fluff words.</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 6 Category Cards */}
              {overallData.breakdown && overallData.breakdown.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {overallData.breakdown.map((cat) => (
                    <div
                      key={cat.category}
                      className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-white/90 mb-1.5">
                          <span>{cat.category}</span>
                          <span className="font-extrabold text-blue-400">
                            {cat.score} / {cat.maxScore}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed">{cat.feedback}</p>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (cat.score / cat.maxScore) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Extracted Skills Badges */}
              {overallData.matchedSkills && overallData.matchedSkills.length > 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Detected Technical Skills ({overallData.matchedSkills.length})
                    </span>
                    <span className="text-[11px] text-white/40">Verified from resume</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {overallData.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-xl border border-blue-500/20 bg-blue-500/08 px-2.5 py-1 text-xs font-medium text-blue-300"
                      >
                        <Check className="h-3 w-3 text-blue-400" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {overallData.strengths && overallData.strengths.length > 0 && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/04 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="h-4 w-4" /> Strongest Attributes
                    </span>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      {overallData.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {overallData.improvements && overallData.improvements.length > 0 && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/04 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                      <Sparkles className="h-4 w-4" /> Actionable Enhancements
                    </span>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      {overallData.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      ) : (
        /* ════════════════ MODE 2: JOB-SPECIFIC ATS MATCH ════════════════ */
        <div className="mt-5 space-y-5">
          {/* Job Description Input Form */}
          <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-black/30 p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">
                  Target Job Title (Optional)
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white">
                  <Briefcase className="h-3.5 w-3.5 text-white/40" />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Software Engineer / SDE-1"
                    className="w-full bg-transparent outline-none placeholder-white/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">
                  Target Company (Optional)
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white">
                  <Building2 className="h-3.5 w-3.5 text-white/40" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google / Microsoft"
                    className="w-full bg-transparent outline-none placeholder-white/30 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-white/60">
                  Job Description Text <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] text-white/40">
                  {jobDescription.length} characters
                </span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="Paste the complete job description, requirements, and responsibilities here..."
                className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/90 placeholder-white/30 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="button"
              disabled={!jobDescription.trim() || loadingJobMatch}
              onClick={handleAnalyzeJobMatch}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loadingJobMatch ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Matching resume against job description...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Analyze Job Match</span>
                </>
              )}
            </button>
          </div>

          {/* Job Match Results */}
          {jobMatchData && (
            <div className="space-y-4">
              {/* Score Header Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                <div className="flex items-center gap-4">
                  <ScoreRing score={jobMatchData.jobMatchScore || 0} />
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                      <Sparkles className="h-3 w-3" /> {jobMatchData.matchLevel}
                    </span>
                    <h3 className="mt-1 text-sm sm:text-base font-bold text-white/90">
                      Target Match: {jobMatchData.jobTitle || 'Target Role'}{' '}
                      {jobMatchData.companyName ? `at ${jobMatchData.companyName}` : ''}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/50">{jobMatchData.summary}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-white/40 block">Overall Resume ATS</span>
                  <span className="text-sm font-bold text-blue-400">
                    {jobMatchData.overallScore} / 100
                  </span>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-white/[0.06] pb-2">
                {[
                  { id: 'OVERVIEW', label: 'Overview', icon: Layers },
                  { id: 'MATCHED', label: `Matched Skills (${jobMatchData.matchedSkills?.length || 0})`, icon: CheckCircle2 },
                  { id: 'MISSING', label: `Missing Skills (${jobMatchData.missingSkills?.length || 0})`, icon: Plus },
                  { id: 'KEYWORDS', label: 'Keywords', icon: Code2 },
                  { id: 'SUGGESTIONS', label: 'AI Suggestions', icon: Sparkles },
                ].map((t) => {
                  const Icon = t.icon
                  const isActive = activeJobTab === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveJobTab(t.id as typeof activeJobTab)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'border border-blue-500/30 bg-blue-500/10 text-blue-400'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{t.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              {activeJobTab === 'OVERVIEW' && (
                <div className="space-y-4">
                  {jobMatchData.breakdown && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {jobMatchData.breakdown.map((cat) => (
                        <div
                          key={cat.category}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs font-semibold text-white/90 mb-1">
                              <span>{cat.category}</span>
                              <span className="font-extrabold text-blue-400">
                                {cat.score} / {cat.maxScore}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50">{cat.feedback}</p>
                          </div>
                          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${Math.min(100, (cat.score / cat.maxScore) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeJobTab === 'MATCHED' && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/04 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Verified Skills in Resume Matching This Job
                  </h4>
                  {jobMatchData.matchedSkills && jobMatchData.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobMatchData.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-400" /> {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/50">No exact technical skills matched between this JD and resume.</p>
                  )}
                </div>
              )}

              {activeJobTab === 'MISSING' && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/04 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Skills mentioned in this job that were not found in your resume
                  </h4>
                  <p className="text-[11px] text-white/50 mb-3">
                    Adding experience or projects covering these skills can significantly increase your interview callback rate.
                  </p>
                  {jobMatchData.missingSkills && jobMatchData.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobMatchData.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300"
                        >
                          <Plus className="h-3.5 w-3.5 text-amber-400" /> {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-400">Great job! Your resume covers all required skills from this job description.</p>
                  )}
                </div>
              )}

              {activeJobTab === 'KEYWORDS' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                    <span>Priority JD Keywords Match Rate</span>
                    <span className="text-blue-400 font-bold">{jobMatchData.keywordMatchPercentage}%</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                        Matched Keywords ({jobMatchData.matchedKeywords?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchData.matchedKeywords?.map((kw) => (
                          <span key={kw} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
                        Missing Keywords ({jobMatchData.missingKeywords?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchData.missingKeywords?.map((kw) => (
                          <span key={kw} className="rounded-lg bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[11px] text-white/60">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeJobTab === 'SUGGESTIONS' && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/90">
                      Context-Aware AI Improvement Suggestions
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {jobMatchData.improvements?.map((imp, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-xs text-white/80 leading-relaxed"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-400">
                          {i + 1}
                        </span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
