import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  RotateCcw,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Building2,
  Lightbulb,
} from 'lucide-react'
import {
  getCompanies,
  createInterviewSession,
  getInterviewHistory,
  getNextInterviewQuestion,
  submitInterviewAnswer,
  completeInterviewSession,
  type CompanySummary,
  type InterviewSession,
  type InterviewQuestion,
  type InterviewHistoryItem,
  type InterviewType,
  type InterviewDifficulty,
} from '../services/api'
import { useMediaStream } from '../hooks/useMediaStream'
import { useSpeechToText } from '../hooks/useSpeechToText'
import { InterviewHistory } from '../components/interview/InterviewHistory'
import { useAuth } from '../contexts/AuthContext'


const INTERVIEW_TYPES: { type: InterviewType; label: string; desc: string }[] = [
  { type: 'TECHNICAL', label: 'Technical & CS Core', desc: 'Algorithms, OS, DBMS & Architecture' },
  { type: 'SYSTEM_DESIGN', label: 'System Design', desc: 'Scalability, microservices & caching' },
  { type: 'DSA', label: 'DSA & Coding', desc: 'Data structures, complexity & optimization' },
  { type: 'HR', label: 'HR & Culture', desc: 'Motivation, career goals & team fit' },
  { type: 'BEHAVIORAL', label: 'Behavioral & Leadership', desc: 'STAR scenarios & conflict resolution' },
  { type: 'MIXED', label: 'Comprehensive Mixed', desc: 'Full-spectrum placement evaluation' },
]

const DIFFICULTIES: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard']

export function MockInterviewPage() {
  const [searchParams] = useSearchParams()
  const initialCompanyId = searchParams.get('company')
  const initialCompanyName = searchParams.get('name')

  const { isAuthenticated } = useAuth()

  // Setup state
  const [companies, setCompanies] = useState<CompanySummary[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(
    initialCompanyId ? parseInt(initialCompanyId, 10) : undefined
  )
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>(
    initialCompanyName || ''
  )
  const [interviewType, setInterviewType] = useState<InterviewType>('TECHNICAL')
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Medium')
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [history, setHistory] = useState<InterviewHistoryItem[]>([])

  // Active Session state
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [latestEval, setLatestEval] = useState<{
    score: number
    evaluation: string
    strengths: string
    improvementAreas: string
  } | null>(null)

  // Loading & Submitting
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [startingSession, setStartingSession] = useState(false)
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [completingSession, setCompletingSession] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Media & Speech Hooks
  const {
    videoRef,
    error: mediaError,
    isVideoEnabled,
    isAudioEnabled,
    startStream,
    stopStream,
    toggleVideo,
    toggleAudio,
  } = useMediaStream()

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useSpeechToText()

  // Load companies & history on mount
  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const comps = await getCompanies()
        if (isMounted) {
          setCompanies(comps)
          if (!selectedCompanyId && comps.length > 0 && !initialCompanyId) {
            setSelectedCompanyId(comps[0].id)
            setSelectedCompanyName(comps[0].name)
          }
        }
      } catch (e) {
        console.error('Failed to load companies:', e)
      }

      if (isAuthenticated) {
        setLoadingHistory(true)
        try {
          const hist = await getInterviewHistory()
          if (isMounted) setHistory(hist)
        } catch (e) {
          console.error('Failed to load history:', e)
        } finally {
          if (isMounted) setLoadingHistory(false)
        }
      }
    }

    init()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  // Handle Start Session
  const handleStartInterview = async () => {
    setStartingSession(true)
    setError(null)
    try {
      // Start camera/mic preview
      await startStream()

      const session = await createInterviewSession({
        companyId: selectedCompanyId,
        companyName: selectedCompanyName || 'Target Company',
        interviewType,
        difficulty,
        durationMinutes,
      })

      setActiveSession(session)
      if (session.questions && session.questions.length > 0) {
        setCurrentQuestion(session.questions[0])
      }
      setLatestEval(null)
      resetTranscript()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start interview session.')
    } finally {
      setStartingSession(false)
    }
  }

  // Handle Submit Answer
  const handleSubmitAnswer = async () => {
    if (!activeSession || !currentQuestion) return
    const textToSubmit = transcript.trim()
    if (!textToSubmit) {
      setError('Please speak or type your answer before submitting.')
      return
    }

    setSubmittingAnswer(true)
    setError(null)
    try {
      if (isListening) stopListening()

      const answer = await submitInterviewAnswer(activeSession.id, currentQuestion.id, {
        transcript: textToSubmit,
        answerDurationSeconds: 45,
      })

      setLatestEval({
        score: answer.score || 0,
        evaluation: answer.aiEvaluation || '',
        strengths: answer.strengths || '',
        improvementAreas: answer.improvementAreas || '',
      })

      // Fetch or generate next adaptive question
      const nextQ = await getNextInterviewQuestion(activeSession.id)
      if (nextQ && nextQ.id !== currentQuestion.id) {
        // Prepare next question
        setTimeout(() => {
          setCurrentQuestion(nextQ)
          resetTranscript()
          setLatestEval(null)
        }, 3500)
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to submit answer.')
    } finally {
      setSubmittingAnswer(false)
    }
  }

  // Handle Complete Session
  const handleCompleteInterview = async () => {
    if (!activeSession) return
    setCompletingSession(true)
    setError(null)
    try {
      if (isListening) stopListening()
      stopStream()

      const finished = await completeInterviewSession(activeSession.id)
      setActiveSession(finished)

      // Refresh history
      try {
        const hist = await getInterviewHistory()
        setHistory(hist)
      } catch (_) {}
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to complete interview.')
    } finally {
      setCompletingSession(false)
    }
  }

  // Handle Reset / Exit Interview
  const handleExitInterview = () => {
    if (isListening) stopListening()
    stopStream()
    setActiveSession(null)
    setCurrentQuestion(null)
    setLatestEval(null)
    resetTranscript()
  }

  // Parse report JSON fields safely
  const reportStrengths = useMemo(() => {
    if (!activeSession?.report?.overallStrengths) return []
    try {
      return JSON.parse(activeSession.report.overallStrengths) as string[]
    } catch {
      return [activeSession.report.overallStrengths]
    }
  }, [activeSession?.report?.overallStrengths])

  const reportWeaknesses = useMemo(() => {
    if (!activeSession?.report?.overallWeaknesses) return []
    try {
      return JSON.parse(activeSession.report.overallWeaknesses) as string[]
    } catch {
      return [activeSession.report.overallWeaknesses]
    }
  }, [activeSession?.report?.overallWeaknesses])

  const reportRecommendations = useMemo(() => {
    if (!activeSession?.report?.recommendations) return []
    try {
      return JSON.parse(activeSession.report.recommendations) as string[]
    } catch {
      return [activeSession.report.recommendations]
    }
  }, [activeSession?.report?.recommendations])

  const reportNextActions = useMemo(() => {
    if (!activeSession?.report?.nextPreparationActions) return []
    try {
      return JSON.parse(activeSession.report.nextPreparationActions) as string[]
    } catch {
      return [activeSession.report.nextPreparationActions]
    }
  }, [activeSession?.report?.nextPreparationActions])

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ─────────────────────────────────────────────────────────────
          STATE 1: SETUP & INTERVIEW SELECTION (When no active session)
      ────────────────────────────────────────────────────────────── */}
      {!activeSession && (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
                    AI Mock Interview Studio
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400">
                    <Sparkles className="h-3 w-3" /> Adaptive Engine
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/50">
                  Simulate high-stakes technical, system design, and behavioral interviews with real-time feedback.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Configuration Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8"
          >
            <h2 className="mb-6 text-base font-semibold tracking-tight text-white/90">
              Configure Interview Session
            </h2>

            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Target Company */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/60">
                  <Building2 className="h-3.5 w-3.5 text-blue-400" />
                  Target Company
                </label>
                <div className="flex flex-wrap gap-2">
                  {companies.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCompanyId(c.id)
                        setSelectedCompanyName(c.name)
                      }}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                        selectedCompanyId === c.id
                          ? 'border-blue-500/30 bg-blue-500/14 text-blue-400 ring-1 ring-blue-500/30'
                          : 'border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCompanyId(undefined)
                      setSelectedCompanyName('General Tech Company')
                    }}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                      !selectedCompanyId
                        ? 'border-blue-500/30 bg-blue-500/14 text-blue-400 ring-1 ring-blue-500/30'
                        : 'border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]'
                    }`}
                  >
                    General / Custom
                  </button>
                </div>
              </div>

              {/* Difficulty & Duration */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/60">
                  Difficulty Level
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                        difficulty === diff
                          ? 'border-purple-500/30 bg-purple-500/14 text-purple-400 ring-1 ring-purple-500/30'
                          : 'border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-medium text-white/60">
                    Session Duration
                  </label>
                  <div className="flex gap-2">
                    {[15, 30, 45, 60].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setDurationMinutes(dur)}
                        className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                          durationMinutes === dur
                            ? 'border-blue-500/30 bg-blue-500/14 text-blue-400 ring-1 ring-blue-500/30'
                            : 'border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]'
                        }`}
                      >
                        {dur} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Track Types */}
            <div className="mt-6">
              <label className="mb-3 block text-xs font-medium text-white/60">
                Select Interview Track
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {INTERVIEW_TYPES.map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setInterviewType(t.type)}
                    className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                      interviewType === t.type
                        ? 'border-blue-500/40 bg-blue-500/10 ring-1 ring-blue-500/30'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-xs font-semibold text-white/90">{t.label}</span>
                    <span className="mt-1 text-[11px] text-white/50">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Camera & Mic Permission Note */}
            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-white/50">
              <p className="flex items-center gap-2 text-white/70 font-medium">
                <Video className="h-4 w-4 text-blue-400" />
                Browser Media & Speech Recognition Ready
              </p>
              <p className="mt-1 text-[11px] leading-relaxed">
                Clicking Start will prompt your browser for camera & microphone permission. Video is rendered locally and is never recorded or uploaded without permission.
              </p>
            </div>

            {/* Start Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStartInterview}
                disabled={startingSession}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {startingSession ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Launch Mock Interview
              </button>
            </div>
          </motion.div>

          {/* Past Interview History */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {loadingHistory ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              </div>
            ) : (
              <InterviewHistory records={history} />
            )}
          </motion.div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STATE 2: ACTIVE INTERVIEW ROOM (IN_PROGRESS)
      ────────────────────────────────────────────────────────────── */}
      {activeSession && activeSession.status === 'IN_PROGRESS' && (
        <div className="space-y-6">
          {/* Top Session Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 font-bold text-blue-400">
                {activeSession.companyName ? activeSession.companyName.slice(0, 2).toUpperCase() : 'AI'}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white/90">
                  {activeSession.companyName} · {activeSession.interviewType}
                </h2>
                <p className="text-xs text-white/40">{activeSession.difficulty} Difficulty · Adaptive Mode</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCompleteInterview}
                disabled={completingSession}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
              >
                {completingSession ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                End & Synthesize Report
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid Layout: Video / Mic Preview & Interviewer Question Card */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Camera Video & Mic Controls (5 cols) */}
            <div className="space-y-4 lg:col-span-5">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090d16] shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
                />
                {!isVideoEnabled && (
                  <div className="flex h-full w-full flex-col items-center justify-center text-white/40">
                    <VideoOff className="h-10 w-10 mb-2" />
                    <p className="text-xs">Camera is turned off</p>
                  </div>
                )}

                {/* Live indicators */}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE STREAM
                  </span>
                </div>

                {/* Bottom Media Controls Bar */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className={`rounded-full p-2 text-xs transition-colors ${
                      isAudioEnabled ? 'bg-white/10 text-white' : 'bg-rose-500/30 text-rose-300'
                    }`}
                    title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleVideo}
                    className={`rounded-full p-2 text-xs transition-colors ${
                      isVideoEnabled ? 'bg-white/10 text-white' : 'bg-rose-500/30 text-rose-300'
                    }`}
                    title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mediaError && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                  {mediaError}
                </div>
              )}
            </div>

            {/* Right: Question, Transcript & Answering Area (7 cols) */}
            <div className="space-y-4 lg:col-span-7">
              {currentQuestion ? (
                <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/40">
                      Question #{currentQuestion.questionOrder}
                    </span>
                    {currentQuestion.isAdaptiveFollowUp && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                        <Sparkles className="h-3 w-3" /> Adaptive Follow-up
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold leading-relaxed text-white/95 sm:text-lg">
                    {currentQuestion.questionText}
                  </h3>

                  {currentQuestion.expectedCriteria && (
                    <div className="mt-3 rounded-2xl border border-blue-500/10 bg-blue-500/05 p-3 text-xs text-blue-300/80">
                      💡 <span className="font-semibold">Evaluation Criteria:</span> {currentQuestion.expectedCriteria}
                    </div>
                  )}

                  {/* Real-time Answer Feedback if evaluated */}
                  {latestEval && (
                    <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">
                          AI Answer Score: {latestEval.score}/100
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/80">{latestEval.evaluation}</p>
                      {latestEval.improvementAreas && (
                        <p className="mt-2 text-[11px] text-amber-300">
                          🎯 <span className="font-semibold">Improvement:</span> {latestEval.improvementAreas}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Transcript Recording & Input Area */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>Live Speech Transcript:</span>
                      {isSpeechSupported && (
                        <button
                          type="button"
                          onClick={isListening ? stopListening : startListening}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all ${
                            isListening
                              ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40 animate-pulse'
                              : 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40 hover:bg-blue-500/30'
                          }`}
                        >
                          <Mic className="h-3.5 w-3.5" />
                          {isListening ? 'Listening (Click to Pause)' : 'Start Speaking'}
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={4}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Your transcribed answer will appear here in real-time as you speak, or you can type directly..."
                      className="w-full rounded-2xl border border-white/[0.08] bg-black/40 p-4 text-xs leading-relaxed text-white/90 placeholder-white/30 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    {interimTranscript && (
                      <p className="text-[11px] italic text-white/40">
                        Hearing: {interimTranscript}...
                      </p>
                    )}

                    {/* Submit Action */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={submittingAnswer || !transcript.trim()}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-40"
                      >
                        {submittingAnswer ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        Submit Answer & Evaluate
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-3" />
                  <h3 className="text-base font-semibold text-white/90">All Questions Completed!</h3>
                  <p className="mt-1 text-xs text-white/50">Ready to synthesize your overall evaluation report.</p>
                  <button
                    onClick={handleCompleteInterview}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg"
                  >
                    Generate Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STATE 3: COMPLETED SESSION & SYNTHESIZED REPORT
      ────────────────────────────────────────────────────────────── */}
      {activeSession && activeSession.status === 'COMPLETED' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Completion Banner */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <h2 className="text-xl font-bold tracking-tight text-white/95 sm:text-2xl">
                    Interview Performance Report
                  </h2>
                </div>
                <p className="mt-1 text-xs text-white/60">
                  {activeSession.companyName} · {activeSession.interviewType} · {activeSession.difficulty} Track
                </p>
                {activeSession.feedbackSummary && (
                  <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/70">
                    {activeSession.feedbackSummary}
                  </p>
                )}
              </div>

              {/* Overall Score Circle */}
              <div className="flex shrink-0 items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6 text-center">
                <div>
                  <div className="text-4xl font-extrabold text-blue-400">
                    {activeSession.overallScore || 0}
                    <span className="text-base text-white/40">/100</span>
                  </div>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Overall Competency
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Metric Score Bars */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Technical Depth</span>
                  <span className="font-bold text-purple-400">{activeSession.technicalScore || 0}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${activeSession.technicalScore || 0}%` }} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Communication & Pacing</span>
                  <span className="font-bold text-blue-400">{activeSession.communicationScore || 0}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${activeSession.communicationScore || 0}%` }} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Answer Completeness</span>
                  <span className="font-bold text-emerald-400">{activeSession.answerQualityScore || 0}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${activeSession.answerQualityScore || 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Columns: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Key Strengths
              </h3>
              <ul className="mt-4 space-y-2.5">
                {reportStrengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-400">
                <AlertCircle className="h-4 w-4" /> Areas for Improvement
              </h3>
              <ul className="mt-4 space-y-2.5">
                {reportWeaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations & Actionable Next Steps */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400">
              <Lightbulb className="h-4 w-4" /> AI Recommendations & Actionable Next Steps
            </h3>
            {reportRecommendations && reportRecommendations.length > 0 && (
              <ul className="mt-3 mb-4 space-y-2">
                {reportRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {reportNextActions.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3.5 text-xs text-white/70">
                  ⚡ {item}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleExitInterview}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Start Another Session
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
