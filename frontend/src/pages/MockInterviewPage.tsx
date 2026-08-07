import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import {
  InterviewHero,
  InterviewCard,
  InterviewHistory,
  InterviewQuestion,
  InterviewTimer,
  InterviewScore,
  InterviewFeedback,
  InterviewStats,
  DifficultySelector,
  CompanySelector,
  EmptyState,
} from '../components/interview'
import {
  MOCK_COMPANIES,
  INTERVIEW_TYPES,
  DURATIONS_MIN,
  QUESTION_BANK,
  buildMockInterviewSession,
  computeInterviewScore,
  buildFeedback,
  SEEDED_HISTORY,
} from '../data/interview'
import type {
  InterviewType,
  Difficulty,
  InterviewSession,
  InterviewRecord,
  InterviewScore as Score,
} from '../data/interview'

const DEFAULT_COMPANY = MOCK_COMPANIES[0].name
const DEFAULT_TYPE: InterviewType = 'HR'
const DEFAULT_DIFFICULTY: Difficulty = 'Medium'
const DEFAULT_DURATION = 30

export function MockInterviewPage() {
  const [company, setCompany] = useState(DEFAULT_COMPANY)
  const [type, setType] = useState<InterviewType>(DEFAULT_TYPE)
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY)
  const [duration, setDuration] = useState(DEFAULT_DURATION)

  const [session, setSession] = useState<InterviewSession | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState<Set<number>>(new Set())
  const [score, setScore] = useState<Score | null>(null)
  const [history, setHistory] = useState<InterviewRecord[]>(SEEDED_HISTORY)
  const [sessionKey, setSessionKey] = useState(0)

  const totalQuestions = QUESTION_BANK.length
  const companiesCount = MOCK_COMPANIES.length

  const start = (overrideType?: InterviewType) => {
    const t = overrideType ?? type
    const s = buildMockInterviewSession(company, t, difficulty, duration)
    setSession(s)
    setScore(null)
    setCurrentIndex(0)
    setAnswered(new Set())
    setSessionKey((k) => k + 1)
  }

  const toggleAnswered = () => {
    setAnswered((prev) => {
      const next = new Set(prev)
      if (next.has(currentIndex)) next.delete(currentIndex)
      else next.add(currentIndex)
      return next
    })
  }

  const finish = () => {
    if (!session) return
    const sc = computeInterviewScore(session, answered.size)
    setScore(sc)

    const record: InterviewRecord = {
      id: `iv-${Date.now()}`,
      company: session.company,
      date: new Date().toISOString().slice(0, 10),
      type: session.type,
      score: sc.overall,
      duration: session.duration,
      result: sc.overall >= 80 ? 'Excellent' : sc.overall >= 60 ? 'Passed' : 'Needs Work',
    }
    setHistory((prev) => [record, ...prev])
  }

  const retry = () => {
    if (!session) return
    const s = buildMockInterviewSession(session.company, session.type, difficulty, duration)
    setSession(s)
    setScore(null)
    setCurrentIndex(0)
    setAnswered(new Set())
    setSessionKey((k) => k + 1)
  }

  const feedback = useMemo(() => (score ? buildFeedback(score) : null), [score])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { transition: { staggerChildren: 0.05 } },
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero */}
      <div className="mb-6">
        <InterviewHero totalQuestions={totalQuestions} companies={companiesCount} />
      </div>

      {/* Statistics */}
      <div className="mb-6">
        <InterviewStats records={history} />
      </div>

      {/* Setup + Active session */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Setup panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
          >
            <h3 className="text-sm font-semibold text-white/90">Interview Setup</h3>

            <CompanySelector value={company} onChange={setCompany} />

            <div>
              <p className="mb-2 text-xs font-medium text-white/50">Interview Type</p>
              <div className="flex flex-wrap gap-2">
                {INTERVIEW_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                      type === t
                        ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
                        : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <DifficultySelector value={difficulty} onChange={setDifficulty} />

            <div>
              <p className="mb-2 text-xs font-medium text-white/50">Duration</p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS_MIN.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                      duration === d
                        ? 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400'
                        : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => start()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500/14 px-4 py-3 text-sm font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              <Play className="h-4 w-4" />
              Start Interview
            </button>
          </motion.div>
        </div>

        {/* Active session */}
        <div className="lg:col-span-2">
          {session ? (
            <div className="space-y-4">
              {score && feedback ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InterviewScore score={score} />
                    <div className="flex flex-col justify-between gap-4">
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
                        <p className="text-xs text-white/40">Session Summary</p>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/50">Company</span>
                            <span className="font-medium text-white/80">{session.company}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50">Type</span>
                            <span className="font-medium text-white/80">{session.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50">Questions</span>
                            <span className="font-medium text-white/80">{session.questions.length}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={retry}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500/14 px-4 py-3 text-sm font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Retry Interview
                      </button>
                    </div>
                  </div>
                  <InterviewFeedback feedback={feedback} />
                </>
              ) : (
                <>
                  <InterviewQuestion
                    questions={session.questions}
                    currentIndex={currentIndex}
                    answered={answered.has(currentIndex)}
                    onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    onNext={() =>
                      setCurrentIndex((i) => Math.min(session.questions.length - 1, i + 1))
                    }
                    onToggleAnswered={toggleAnswered}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InterviewTimer durationMinutes={session.duration} onResetSignal={sessionKey} />
                    <div className="flex flex-col justify-center gap-2">
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span>Progress</span>
                        <span>
                          {answered.size} / {session.questions.length} answered
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full bg-blue-500"
                          animate={{
                            width: `${(answered.size / session.questions.length) * 100}%`,
                          }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <button
                        onClick={finish}
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/14 px-4 py-3 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                      >
                        Finish &amp; Get Score
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <EmptyState onStart={() => start()} />
          )}
        </div>
      </div>

      {/* Interview cards */}
      <div className="mb-6">
        <h3 className="mb-4 text-sm font-semibold text-white/90">Interview Types</h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {INTERVIEW_TYPES.map((t) => (
            <InterviewCard key={t} type={t} difficulty={difficulty} onStart={(t) => start(t)} />
          ))}
        </motion.div>
      </div>

      {/* History */}
      <div>
        <InterviewHistory records={history} />
      </div>
    </div>
  )
}
