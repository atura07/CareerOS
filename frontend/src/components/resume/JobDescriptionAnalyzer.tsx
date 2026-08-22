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
  Eye,
  TrendingUp,
  History,
  Wand2,
  Target,
  Copy,
} from 'lucide-react'
import type { ResumeFile } from './types'
import {
  getUniversalIntelligence,
  analyzeJobMatchIntelligence,
  improveBullet,
  getResumeAnalysisHistory,
} from '../../services/api'
import type {
  AtsIntelligenceResponse,
  BulletImprovementResponse,
  CategoryDetail,
  SuggestedKeywordItem,
  ActionableIssue,
} from '../../services/api'

interface JobDescriptionAnalyzerProps {
  resume: ResumeFile | null
}

const TARGET_ROLES = [
  'Software Engineer',
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'General',
]

function ScoreRing({ score, size = 110 }: { score: number; size?: number }) {
  const radius = size * 0.4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference

  const color =
    score >= 90 ? '#3b82f6' :
    score >= 80 ? '#10b981' :
    score >= 70 ? '#06b6d4' :
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
  const [mode, setMode] = useState<'UNIVERSAL' | 'JOB_MATCH'>('UNIVERSAL')
  const [targetRole, setTargetRole] = useState('Software Engineer')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [activeJobTab, setActiveJobTab] = useState<'OVERVIEW' | 'MATCHED' | 'MISSING' | 'KEYWORDS' | 'SUGGESTIONS'>('OVERVIEW')

  const [loadingUniversal, setLoadingUniversal] = useState(false)
  const [loadingJobMatch, setLoadingJobMatch] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [universalData, setUniversalData] = useState<AtsIntelligenceResponse | null>(null)
  const [jobMatchData, setJobMatchData] = useState<AtsIntelligenceResponse | null>(null)
  const [historyList, setHistoryList] = useState<AtsIntelligenceResponse[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showFormula, setShowFormula] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Bullet Improver State
  const [bulletModalOpen, setBulletModalOpen] = useState(false)
  const [bulletInput, setBulletInput] = useState('')
  const [bulletContextTech, setBulletContextTech] = useState('')
  const [bulletLoading, setBulletLoading] = useState(false)
  const [bulletResult, setBulletResult] = useState<BulletImprovementResponse | null>(null)
  const [copiedBullet, setCopiedBullet] = useState(false)

  // Fetch Universal Intelligence whenever selected resume or target role changes
  useEffect(() => {
    if (!resume || !resume.id) {
      setUniversalData(null)
      setJobMatchData(null)
      setHistoryList([])
      return
    }

    let isMounted = true
    setLoadingUniversal(true)
    setError(null)

    getUniversalIntelligence(Number(resume.id), targetRole)
      .then((data: AtsIntelligenceResponse) => {
        if (isMounted) setUniversalData(data)
      })
      .catch((err: unknown) => {
        if (isMounted) logError(err)
      })
      .finally(() => {
        if (isMounted) setLoadingUniversal(false)
      })

    // Fetch history
    getResumeAnalysisHistory(Number(resume.id))
      .then((hist: AtsIntelligenceResponse[]) => {
        if (isMounted) setHistoryList(hist)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [resume?.id, targetRole])

  const logError = (err: unknown) => {
    const msg = err && typeof err === 'object' && 'response' in err
      ? (err as { response: { data?: { message?: string; error?: string } } }).response?.data?.message
      : undefined
    setError(msg || 'Could not load Resume Intelligence analysis. Please try again.')
  }

  const handleAnalyzeJobMatch = async () => {
    if (!resume || !jobDescription.trim()) return

    setLoadingJobMatch(true)
    setError(null)

    try {
      const data = await analyzeJobMatchIntelligence(Number(resume.id), {
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

  const handleImproveBulletSubmit = async () => {
    if (!bulletInput.trim()) return
    setBulletLoading(true)
    try {
      const res = await improveBullet({
        originalBullet: bulletInput.trim(),
        targetRole,
        contextTech: bulletContextTech.trim() || undefined,
      })
      setBulletResult(res)
    } catch (err: unknown) {
      logError(err)
    } finally {
      setBulletLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBullet(true)
    setTimeout(() => setCopiedBullet(false), 2000)
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
              Resume Intelligence & ATS Analyzer
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-white/50">
            {mode === 'UNIVERSAL'
              ? 'Estimated ATS Compatibility evaluated across 7 deterministic categories.'
              : 'Targeted keyword & skill alignment matched against specific Job Description.'}
          </p>
        </div>

        {/* Tab & Utility Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Target Role Selector */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-black/40 px-3 py-1.5 text-xs text-white/70">
            <Target className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] text-white/40">Role:</span>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r} className="bg-zinc-900 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="inline-flex rounded-2xl border border-white/[0.08] bg-black/40 p-1">
            <button
              type="button"
              onClick={() => setMode('UNIVERSAL')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                mode === 'UNIVERSAL'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Universal Check
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

          {/* Bullet Improver Trigger */}
          <button
            type="button"
            onClick={() => setBulletModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
          >
            <Wand2 className="h-3.5 w-3.5" /> Improve Bullet
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
          Select or upload a resume from the library to view CareerOS ATS Compatibility.
        </div>
      ) : mode === 'UNIVERSAL' ? (
        /* ════════════════ MODE 1: UNIVERSAL ATS INTELLIGENCE ════════════════ */
        <div className="mt-5 space-y-5">
          {loadingUniversal ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/50 text-xs">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              <span>Running multi-stage extraction and 7-category evaluation for {targetRole}...</span>
            </div>
          ) : universalData ? (
            <>
              {/* Hero Score Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-white/[0.08] bg-black/30 p-5">
                <div className="flex items-center gap-4">
                  <ScoreRing score={universalData.overallScore} />
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400">
                        <Sparkles className="h-3 w-3" /> {universalData.scoreLabel}
                      </span>

                      {/* Confidence Tag */}
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-white/70">
                        {universalData.confidence}% Confidence
                      </span>

                      {/* Extraction Status Badge */}
                      {universalData.extraction?.method === 'OCR_FALLBACK' || universalData.extraction?.status === 'OCR_USED' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-300">
                          <Eye className="h-3 w-3" /> OCR-assisted
                        </span>
                      ) : universalData.extraction?.method === 'POI_DOCX' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                          <FileText className="h-3 w-3" /> DOCX structured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-white/70">
                          <FileText className="h-3 w-3" /> Direct text
                        </span>
                      )}

                      {/* Real Historical Comparison Tag */}
                      {universalData.historyComparison && universalData.historyComparison.scoreDelta !== 0 && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          universalData.historyComparison.scoreDelta > 0
                            ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                        }`}>
                          <TrendingUp className="h-3 w-3" />
                          {universalData.historyComparison.scoreDelta > 0 ? `+${universalData.historyComparison.scoreDelta}` : universalData.historyComparison.scoreDelta} vs last review
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1.5 text-sm sm:text-base font-bold text-white/90">
                      CareerOS ATS Compatibility Score
                    </h3>
                    <p className="mt-0.5 text-xs text-white/50 leading-relaxed max-w-sm">
                      {universalData.summary?.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFormula(!showFormula)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>How is this calculated?</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showFormula ? 'rotate-180' : ''}`} />
                  </button>

                  {historyList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setShowHistory(!showHistory)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
                    >
                      <History className="h-3.5 w-3.5" />
                      <span>View Version History ({historyList.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Version History Drawer */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-2"
                  >
                    <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                      Real Analysis Revision History
                    </h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {historyList.map((h: AtsIntelligenceResponse, i: number) => (
                        <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.04] px-3 py-2 text-xs">
                          <div>
                            <span className="font-semibold text-white/90">{h.targetRole || 'Software Engineer'}</span>
                            <span className="text-[11px] text-white/40 block">{h.analyzedAt ? new Date(h.analyzedAt).toLocaleDateString() : 'Previous version'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-blue-400">{h.overallScore}/100</span>
                            <span className="text-[11px] text-white/50">{h.scoreLabel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expandable Scoring Formula Breakdown */}
              <AnimatePresence>
                {showFormula && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-white/60 space-y-2"
                  >
                    <p className="font-semibold text-white/90">Deterministic Universal ATS Formula (100 Pts):</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/60 pt-1">
                      <li>• <strong className="text-white/80">Parsability & Document Health (15 pts):</strong> Text readability, UTF-8 clean stream, density, absence of corrupt glyphs.</li>
                      <li>• <strong className="text-white/80">Core Section Completeness (20 pts):</strong> Contact, Summary, Education, Skills, Projects, Experience (Fresher-aware).</li>
                      <li>• <strong className="text-white/80">Contact & Professional Identity (10 pts):</strong> Name, verified email, phone, GitHub/LinkedIn profile links.</li>
                      <li>• <strong className="text-white/80">Skills & Technical Signals (15 pts):</strong> Normalized skill diversity + in-project evidence credibility.</li>
                      <li>• <strong className="text-white/80">Experience & Project Quality (20 pts):</strong> Engineering action verbs, quantified metrics (%, users, latency), repo links.</li>
                      <li>• <strong className="text-white/80">Readability & ATS Safety (10 pts):</strong> Standard headings, bullet structure, zero keyword spam.</li>
                      <li>• <strong className="text-white/80">Achievements & Profile Strength (10 pts):</strong> Certifications, hackathons, competitive programming, awards.</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 7 Category Cards */}
              {universalData.scoreBreakdown && universalData.scoreBreakdown.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {universalData.scoreBreakdown.map((cat: CategoryDetail) => {
                    const isExpanded = expandedCategory === cat.category
                    return (
                      <div
                        key={cat.category}
                        className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 cursor-pointer hover:border-white/[0.12] transition-colors"
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-white/90 mb-1.5">
                            <span className="flex items-center gap-1.5">
                              {cat.category}
                              {cat.status === 'STRONG' && <Check className="h-3 w-3 text-emerald-400" />}
                            </span>
                            <span className="font-extrabold text-blue-400">
                              {cat.score} / {cat.maxScore}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/50 leading-relaxed">{cat.reason}</p>

                          {/* Expandable Evidence */}
                          <AnimatePresence>
                            {isExpanded && cat.evidence && cat.evidence.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2.5 pt-2 border-t border-white/[0.04] space-y-1"
                              >
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                                  Resume Evidence
                                </span>
                                {cat.evidence.map((ev: string, i: number) => (
                                  <p key={i} className="text-[11px] text-emerald-300/80 leading-tight">
                                    • {ev}
                                  </p>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, (cat.score / cat.maxScore) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Detected Skills & Role Benchmark Suggestions */}
              {universalData.keywordAnalysis && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Verified Technical Skills ({universalData.keywordAnalysis.matched?.length || 0})
                    </span>
                    <span className="text-[11px] text-white/40">
                      Benchmarked for {targetRole}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {universalData.keywordAnalysis.matched?.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-xl border border-blue-500/20 bg-blue-500/08 px-2.5 py-1 text-xs font-medium text-blue-300"
                      >
                        <Check className="h-3 w-3 text-blue-400" /> {skill}
                      </span>
                    ))}
                  </div>

                  {universalData.keywordAnalysis.suggested && universalData.keywordAnalysis.suggested.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.04]">
                      <span className="text-[11px] font-bold text-white/50 block mb-1.5">
                        Recommended Additional Keywords for {targetRole}:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {universalData.keywordAnalysis.suggested.map((sug: SuggestedKeywordItem, i: number) => (
                          <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-2.5 text-xs">
                            <span className="font-semibold text-white/80">{sug.keyword}</span>
                            <span className="text-[10px] text-blue-400/80 ml-1.5">({sug.category})</span>
                            <p className="text-[11px] text-white/40 mt-0.5">{sug.whyItMatters}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Critical Issues & Quick Wins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {universalData.criticalIssues && universalData.criticalIssues.length > 0 && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/04 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2">
                      <AlertCircle className="h-4 w-4" /> High-Impact Improvements
                    </span>
                    <ul className="space-y-2 text-xs">
                      {universalData.criticalIssues.map((issue: ActionableIssue, i: number) => (
                        <li key={i} className="rounded-xl border border-red-500/10 bg-red-500/04 p-2.5 text-white/80">
                          <span className="font-semibold text-red-300">{issue.title}</span>
                          <p className="text-[11px] text-white/60 mt-0.5">{issue.fix}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {universalData.quickWins && universalData.quickWins.length > 0 && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/04 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                      <Sparkles className="h-4 w-4" /> Quick Wins Checklist
                    </span>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      {universalData.quickWins.map((qw: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{qw}</span>
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
          {/* Job Description Form */}
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
                    placeholder="e.g. Senior Java Backend Engineer"
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
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                        <Sparkles className="h-3 w-3" /> {jobMatchData.matchLevel}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-white/70">
                        {jobMatchData.confidence}% Confidence
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm sm:text-base font-bold text-white/90">
                      Target Match: {jobMatchData.jobTitle || 'Target Role'}{' '}
                      {jobMatchData.companyName ? `at ${jobMatchData.companyName}` : ''}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/50">{jobMatchData.summary?.description}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-white/40 block">Universal Compatibility</span>
                  <span className="text-sm font-bold text-blue-400">
                    {jobMatchData.overallScore} / 100
                  </span>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-white/[0.06] pb-2">
                {[
                  { id: 'OVERVIEW', label: 'Overview', icon: Layers },
                  { id: 'MATCHED', label: `Required Skills (${jobMatchData.jobMatch?.matchedRequiredSkills?.length || 0})`, icon: CheckCircle2 },
                  { id: 'MISSING', label: `Missing Skills (${jobMatchData.jobMatch?.missingRequiredSkills?.length || 0})`, icon: Plus },
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
                  {jobMatchData.scoreBreakdown && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {jobMatchData.scoreBreakdown.map((cat: CategoryDetail) => (
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
                            <p className="text-[11px] text-white/50">{cat.reason}</p>
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
                    Verified Skills in Resume Matching Stated Job Requirements
                  </h4>
                  {jobMatchData.jobMatch?.matchedRequiredSkills && jobMatchData.jobMatch.matchedRequiredSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobMatchData.jobMatch.matchedRequiredSkills.map((s: string) => (
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
                    Skills mentioned in this job description that were not detected in your resume
                  </h4>
                  <p className="text-[11px] text-white/50 mb-3">
                    Adding practical experience or projects covering these skills will maximize your interview callback rate.
                  </p>
                  {jobMatchData.jobMatch?.missingRequiredSkills && jobMatchData.jobMatch.missingRequiredSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobMatchData.jobMatch.missingRequiredSkills.map((s: string) => (
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
                    <span>Priority JD Keywords Alignment Rate</span>
                    <span className="text-blue-400 font-bold">
                      {Math.round(jobMatchData.keywordAnalysis?.keywordCoverage || 0)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                        Matched Keywords ({jobMatchData.keywordAnalysis?.matched?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchData.keywordAnalysis?.matched?.map((kw: string) => (
                          <span key={kw} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
                        Missing Keywords ({jobMatchData.keywordAnalysis?.missing?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchData.keywordAnalysis?.missing?.map((kw: string) => (
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
                    {jobMatchData.quickWins?.map((imp: string, i: number) => (
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

      {/* ── Interactive Bullet Improver Modal ── */}
      <AnimatePresence>
        {bulletModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-zinc-950 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Interactive Resume Bullet Improver
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setBulletModalOpen(false)}
                  className="text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Paste or type a weak bullet point:
                </label>
                <textarea
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  rows={3}
                  placeholder="e.g. Worked on backend project using Spring Boot and Postgres"
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-xs text-white/90 outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Context Technologies (Optional):
                </label>
                <input
                  type="text"
                  value={bulletContextTech}
                  onChange={(e) => setBulletContextTech(e.target.value)}
                  placeholder="e.g. Spring Boot, PostgreSQL, Redis"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 text-xs text-white/90 outline-none focus:border-purple-500/50"
                />
              </div>

              <button
                type="button"
                disabled={!bulletInput.trim() || bulletLoading}
                onClick={handleImproveBulletSubmit}
                className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-500 transition-all disabled:opacity-40"
              >
                {bulletLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Rewriting bullet...
                  </span>
                ) : (
                  'Enhance Bullet Point'
                )}
              </button>

              {bulletResult && (
                <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-purple-300">Recommended Action Rewrite:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(bulletResult.improvedBullet)}
                        className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" /> {copiedBullet ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-medium">
                      • {bulletResult.improvedBullet}
                    </p>
                  </div>

                  {bulletResult.alternativeVariations && bulletResult.alternativeVariations.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-white/60 block mb-1">Alternative Variations:</span>
                      <ul className="space-y-1.5 text-xs text-white/70">
                        {bulletResult.alternativeVariations.map((v: string, idx: number) => (
                          <li key={idx} className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 flex items-start justify-between gap-2">
                            <span>• {v}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(v)}
                              className="text-white/40 hover:text-white text-[10px] shrink-0"
                            >
                              Copy
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {bulletResult.metricsPlaceholderPrompts && bulletResult.metricsPlaceholderPrompts.length > 0 && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/04 p-3">
                      <span className="text-[11px] font-bold text-amber-400 block mb-1">
                        Questions to Help You Add Real Measurable Metrics (Never Fabricate):
                      </span>
                      <ul className="space-y-1 text-[11px] text-white/70">
                        {bulletResult.metricsPlaceholderPrompts.map((q: string, idx: number) => (
                          <li key={idx}>- {q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
