import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Zap, Loader2, AlertCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import type { ResumeFile } from './types'
import { analyzeResumeAgainstJobDescription } from '../../services/api'
import type { ATSAnalysisResponse } from '../../services/api'

interface JobDescriptionAnalyzerProps {
  resume: ResumeFile | null
}

/* ─── Score Ring Component ─────────────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 80 ? '#22c55e' :
    score >= 60 ? '#eab308' :
    score >= 40 ? '#f97316' :
                  '#ef4444'

  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
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
        <span className="text-3xl font-bold tracking-tight text-white/90">
          {score}
        </span>
        <span className="text-xs text-white/40">/ 100</span>
      </div>
    </div>
  )
}

/* ─── Results Panel ───────────────────────────────────────────────────── */

function ResultsPanel({ result }: { result: ATSAnalysisResponse }) {
  if (!result) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-6 space-y-5 overflow-hidden"
    >
      {/* ── Score Card ── */}
      <div className="flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur">
        <p className="mb-3 text-xs font-semibold tracking-wider uppercase text-white/50">
          ATS Score
        </p>
        <ScoreRing score={result.score} />
        <p className="mt-3 text-xs text-white/40">
          {result.score >= 80
            ? 'Excellent match!'
            : result.score >= 60
            ? 'Good match — room for improvement.'
            : result.score >= 40
            ? 'Fair match — consider adding more relevant keywords.'
            : 'Low match — significant changes recommended.'}
        </p>
      </div>

      {/* ── Matched Keywords ── */}
      {result.matchedKeywords.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-green-400/80">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Matched Keywords
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Missing Keywords ── */}
      {result.missingKeywords.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-red-400/80">
            <XCircle className="h-3.5 w-3.5" />
            Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.missingKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Suggestions ── */}
      {result.suggestions.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur">
          <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-400/80">
            <Lightbulb className="h-3.5 w-3.5" />
            Suggestions
          </h4>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-white/60"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-medium text-amber-400">
                  {idx + 1}
                </span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Error Banner ─────────────────────────────────────────────────────── */

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/8 p-3"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-red-300">Analysis failed</p>
        <p className="mt-0.5 text-xs text-red-300/70">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-red-400/50 transition-colors hover:bg-red-500/10 hover:text-red-300"
      >
        <XCircle className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

/* ─── Main Component ──────────────────────────────────────────────────── */

export function JobDescriptionAnalyzer({ resume }: JobDescriptionAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ATSAnalysisResponse | null>(null)

  const isAnalyzeDisabled = !resume || jobDescription.trim().length === 0 || loading

  const handleAnalyze = async () => {
    if (!resume) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeResumeAgainstJobDescription(
        Number(resume.id),
        jobDescription.trim(),
      )
      setResult(data)
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data?: { error?: string } } }).response?.data?.error
          : undefined
      setError(
        message ?? 'Unable to analyze the resume. Please check your connection and try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDismissError = () => setError(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <Briefcase className="h-4 w-4 text-white/40" />
        Job Description
      </h3>

      <textarea
        value={jobDescription}
        onChange={(e) => {
          setJobDescription(e.target.value)
          if (result) setResult(null)
        }}
        rows={12}
        placeholder="Paste the complete job description here..."
        className="w-full resize-y rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/80 placeholder-white/30 outline-none transition-colors focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
      />

      <button
        type="button"
        disabled={isAnalyzeDisabled}
        onClick={handleAnalyze}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Analyze Resume
          </>
        )}
      </button>

      {!resume && !result && (
        <p className="mt-3 text-center text-xs text-white/30">
          Upload a resume and paste a job description to begin ATS analysis.
        </p>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && <ErrorBanner message={error} onDismiss={handleDismissError} />}
      </AnimatePresence>

      {/* Results */}
      {result && <ResultsPanel result={result} />}
    </motion.div>
  )
}

