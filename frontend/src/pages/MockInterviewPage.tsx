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
  Bot,
  User as UserIcon,
  BookOpen,
  Target,
  BrainCircuit,
} from 'lucide-react'
import {
  getCompanies,
  createInterviewSession,
  getInterviewHistory,
  submitInterviewAnswer,
  completeInterviewSession,
  type CompanySummary,
  type InterviewSession,
  type InterviewQuestion,
  type InterviewHistoryItem,
  type InterviewType,
  type InterviewDifficulty,
  type CandidateEvaluation,
} from '../services/api'
import { useMediaStream } from '../hooks/useMediaStream'
import { useSpeechToText } from '../hooks/useSpeechToText'
import { InterviewHistory } from '../components/interview/InterviewHistory'
import { useAuth } from '../contexts/AuthContext'

const INTERVIEW_TYPES: { type: InterviewType; label: string; desc: string }[] = [
  { type: 'TECHNICAL', label: 'Technical & CS Core', desc: 'Algorithms, OS, DBMS & Backend Architecture' },
  { type: 'SYSTEM_DESIGN', label: 'System Design', desc: 'Scalability, microservices & caching' },
  { type: 'DSA', label: 'DSA & Problem Solving', desc: 'Data structures, complexity & edge cases' },
  { type: 'HR', label: 'HR & Culture', desc: 'Motivation, career goals & team fit' },
  { type: 'BEHAVIORAL', label: 'Behavioral & Leadership', desc: 'STAR scenarios & conflict resolution' },
  { type: 'MIXED', label: 'Comprehensive Mixed', desc: 'Full-spectrum placement evaluation' },
]

const DIFFICULTIES: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard']

interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  stage?: string
  topic?: string
  text: string
  evaluation?: CandidateEvaluation
  timestamp?: string
}

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
  const [roleTitle, setRoleTitle] = useState('Software Engineer')
  const [interviewType, setInterviewType] = useState<InterviewType>('TECHNICAL')
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Medium')
  const [durationMinutes] = useState(30)
  const [history, setHistory] = useState<InterviewHistoryItem[]>([])

  // Active Session state
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  // Loading & Submitting
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
        try {
          const hist = await getInterviewHistory()
          if (isMounted) setHistory(hist)
        } catch (e) {
          console.error('Failed to load history:', e)
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
        roleTitle,
        interviewType,
        difficulty,
        durationMinutes,
      })

      setActiveSession(session)
      if (session.questions && session.questions.length > 0) {
        const firstQ = session.questions[0]
        setCurrentQuestion(firstQ)
        setChatMessages([
          {
            id: `ai-${firstQ.id}`,
            sender: 'ai',
            stage: session.currentStage || 'INTRODUCTION',
            topic: firstQ.category,
            text: firstQ.questionText,
          },
        ])
      }
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

      // Optimistically push candidate message to chat
      const candidateMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: textToSubmit,
      }
      setChatMessages((prev) => [...prev, candidateMsg])

      const response = await submitInterviewAnswer(activeSession.id, currentQuestion.id, {
        transcript: textToSubmit,
        answerDurationSeconds: 45,
      })

      // Update session state
      if (response.interviewState) {
        setActiveSession((prev) =>
          prev
            ? {
                ...prev,
                currentStage: response.interviewState.currentStage,
              }
            : null
        )
      }

      // Add evaluation note to candidate message
      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === candidateMsg.id ? { ...msg, evaluation: response.evaluation } : msg))
      )

      if (response.nextQuestion) {
        const nextQ = response.nextQuestion
        setCurrentQuestion(nextQ)
        setChatMessages((prev) => [
          ...prev,
          {
            id: `ai-${nextQ.id}`,
            sender: 'ai',
            stage: response.interviewState.currentStage,
            topic: nextQ.category,
            text: nextQ.questionText,
          },
        ])
      } else {
        setCurrentQuestion(null)
      }

      resetTranscript()
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
      setError(err?.response?.data?.message || err?.message || 'Failed to synthesize report.')
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
    setChatMessages([])
    resetTranscript()
  }

  // Report JSON Parse Helpers
  const parseJsonArray = (json?: string): string[] => {
    if (!json) return []
    try {
      const parsed = JSON.parse(json)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const reportStrengths = useMemo(
    () => parseJsonArray(activeSession?.report?.overallStrengths),
    [activeSession]
  )
  const reportWeaknesses = useMemo(
    () => parseJsonArray(activeSession?.report?.overallWeaknesses),
    [activeSession]
  )
  const reportQuestionsWell = useMemo(
    () => parseJsonArray(activeSession?.report?.questionsAnsweredWell),
    [activeSession]
  )
  const reportQuestionsImprove = useMemo(
    () => parseJsonArray(activeSession?.report?.questionsNeedingImprovement),
    [activeSession]
  )
  const reportRecommendations = useMemo(
    () => parseJsonArray(activeSession?.report?.recommendations),
    [activeSession]
  )
  const reportDsaTopics = useMemo(
    () => parseJsonArray(activeSession?.report?.recommendedDsaTopics),
    [activeSession]
  )

  const readinessColor = (level?: string) => {
    switch (level?.toUpperCase()) {
      case 'INTERVIEW READY':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      case 'GOOD':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
      case 'DEVELOPING':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
      default:
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─────────────────────────────────────────────────────────────
          STATE 1: SETUP SCREEN
      ────────────────────────────────────────────────────────────── */}
      {!activeSession && (
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 backdrop-blur">
                  <BrainCircuit className="h-3.5 w-3.5" /> OpenAI Conversational Engine
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white/95 sm:text-3xl">
                AI Mock Interview
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Practice realistic, conversational placement interviews with an adaptive AI hiring manager.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Configuration Form Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8">
            <h2 className="text-base font-semibold text-white/90">Configure Your Interview Session</h2>
            <p className="mt-1 text-xs text-white/50">
              Select your target company, role, track, and difficulty. The AI will tailor the conversational flow accordingly.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Target Company */}
              <div>
                <label className="block text-xs font-semibold text-white/70">Target Company</label>
                <select
                  value={selectedCompanyId || ''}
                  onChange={(e) => {
                    const id = parseInt(e.target.value, 10)
                    setSelectedCompanyId(id)
                    const c = companies.find((x) => x.id === id)
                    setSelectedCompanyName(c ? c.name : '')
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-[#0c121e] px-4 py-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name} ({comp.packageInfo || 'Tech'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-xs font-semibold text-white/70">Target Role</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Software Engineer, Backend SDE"
                  className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-[#0c121e] px-4 py-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-white/70">Difficulty Level</label>
                <div className="mt-2 flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 rounded-2xl py-3 text-xs font-semibold transition-all ${
                        difficulty === d
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
                          : 'border border-white/[0.06] bg-[#0c121e] text-white/60 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Track Selector */}
            <div className="mt-6">
              <label className="block text-xs font-semibold text-white/70">Interview Focus Track</label>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {INTERVIEW_TYPES.map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setInterviewType(t.type)}
                    className={`flex flex-col rounded-2xl border p-4 text-left transition-all ${
                      interviewType === t.type
                        ? 'border-blue-500/50 bg-blue-500/10 text-white ring-1 ring-blue-500/30'
                        : 'border-white/[0.06] bg-[#0c121e] text-white/70 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold">{t.label}</span>
                    <span className="mt-1 text-[11px] text-white/40">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Action */}
            <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
              <div className="text-xs text-white/40">
                🎙️ Camera & Microphone will be initialized upon launch.
              </div>
              <button
                type="button"
                onClick={handleStartInterview}
                disabled={startingSession}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {startingSession ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Starting Interview...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" /> Start Mock Interview
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Past Interview History */}
          {isAuthenticated && (
            <div className="mt-10">
              <h2 className="text-base font-semibold text-white/90 mb-4">Your Past Mock Interviews</h2>
              <InterviewHistory records={history} />
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STATE 2: ACTIVE CONVERSATIONAL INTERVIEW
      ────────────────────────────────────────────────────────────── */}
      {activeSession && activeSession.status === 'IN_PROGRESS' && (
        <div className="space-y-6">
          {/* Top Session Status Bar */}
          <div className="flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 font-bold text-blue-400">
                {activeSession.companyName ? activeSession.companyName.slice(0, 2).toUpperCase() : 'AI'}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white/90">
                  {activeSession.companyName} · {activeSession.roleTitle || 'Software Engineer'}
                </h2>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>{activeSession.difficulty} Difficulty</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-400">
                    <Sparkles className="h-3 w-3" /> Stage: {activeSession.currentStage || 'INTRODUCTION'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCompleteInterview}
                disabled={completingSession}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50 transition-all"
              >
                {completingSession ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                End & Generate Report
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid Layout: Left Camera Preview (4 cols) & Right Conversational Stream (8 cols) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Live Webcam Preview & Controls */}
            <div className="space-y-4 lg:col-span-4">
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

                {/* Live stream badge */}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                  </span>
                </div>

                {/* Bottom Media Controls Bar */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className={`rounded-full p-2 text-xs transition-colors ${
                      isAudioEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500/30 text-rose-300'
                    }`}
                    title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleVideo}
                    className={`rounded-full p-2 text-xs transition-colors ${
                      isVideoEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500/30 text-rose-300'
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

              {/* Mini Interview Progress & Tips Card */}
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur">
                <h3 className="text-xs font-semibold text-white/80">Conversational Tips</h3>
                <ul className="mt-3 space-y-2 text-[11px] text-white/50">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Speak naturally and mention real technologies and project architectures.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>The AI listens to your responses and asks customized follow-up questions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Conversational Dialogue Stream & Answer Input */}
            <div className="space-y-4 lg:col-span-8">
              {/* Conversation Messages Timeline */}
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
                <div className="space-y-5">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                          <Bot className="h-5 w-5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-3xl p-5 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600/20 border border-blue-500/30 text-white/95 rounded-tr-sm'
                            : 'bg-white/[0.04] border border-white/[0.08] text-white/90 rounded-tl-sm'
                        }`}
                      >
                        {msg.sender === 'ai' && (
                          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-blue-400">
                            <span>AI Interviewer {msg.topic ? `· ${msg.topic}` : ''}</span>
                            {msg.stage && (
                              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-300">
                                {msg.stage}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        {/* If this user message has evaluation feedback attached */}
                        {msg.evaluation && (
                          <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-300">
                            <div className="flex items-center justify-between font-bold mb-1">
                              <span>AI Score: {msg.evaluation.score}/100</span>
                              <span>Accuracy: {msg.evaluation.technicalAccuracy}%</span>
                            </div>
                            <p className="text-white/80">{msg.evaluation.briefFeedback}</p>
                          </div>
                        )}
                      </div>

                      {msg.sender === 'user' && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                          <UserIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing / Generating Indicator */}
                  {submittingAnswer && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
                        <Bot className="h-5 w-5 animate-pulse" />
                      </div>
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white/60">
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                          AI is analyzing your response and formulating the follow-up question...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate Live Response Input Area */}
                {currentQuestion && (
                  <div className="mt-6 border-t border-white/[0.06] pt-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>Your Response (Speak or Type):</span>
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
                      placeholder="Type your answer or speak with the microphone. Be detailed and explain your thought process..."
                      className="w-full rounded-2xl border border-white/[0.08] bg-black/40 p-4 text-xs leading-relaxed text-white/90 placeholder-white/30 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />

                    {interimTranscript && (
                      <p className="text-[11px] italic text-white/40">
                        Hearing: {interimTranscript}...
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={submittingAnswer || !transcript.trim()}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-40"
                      >
                        {submittingAnswer ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Send Answer & Next Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                  <Trophy className="h-6 w-6 text-amber-400" />
                  <h2 className="text-xl font-bold tracking-tight text-white/95 sm:text-2xl">
                    Placement Interview Evaluation Report
                  </h2>
                </div>
                <p className="mt-1 text-xs text-white/60">
                  {activeSession.companyName} · {activeSession.roleTitle || 'Software Engineer'} · {activeSession.difficulty} Difficulty
                </p>
                {activeSession.report?.personalizedMessage && (
                  <p className="mt-4 max-w-3xl rounded-2xl border border-blue-500/20 bg-blue-500/05 p-4 text-xs leading-relaxed text-white/80">
                    💬 <span className="font-semibold text-blue-300">Interviewer Summary:</span> {activeSession.report.personalizedMessage}
                  </p>
                )}
              </div>

              {/* Overall Score Circle & Readiness Badge */}
              <div className="flex flex-col items-center gap-3 shrink-0 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 text-center">
                <div>
                  <div className="text-5xl font-extrabold text-blue-400">
                    {activeSession.overallScore || 0}
                    <span className="text-base text-white/40">/100</span>
                  </div>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Overall Placement Score
                  </span>
                </div>
                {activeSession.report?.interviewReadiness && (
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold ${readinessColor(
                      activeSession.report.interviewReadiness
                    )}`}
                  >
                    {activeSession.report.interviewReadiness}
                  </span>
                )}
              </div>
            </div>

            {/* 4 Detailed Score Dimensions */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Technical Knowledge</span>
                  <span className="font-bold text-purple-400">{activeSession.technicalScore || 0}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${activeSession.technicalScore || 0}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Communication & Clarity</span>
                  <span className="font-bold text-blue-400">{activeSession.communicationScore || 0}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${activeSession.communicationScore || 0}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Problem Solving / DSA</span>
                  <span className="font-bold text-emerald-400">{activeSession.problemSolvingScore || activeSession.overallScore || 0}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${activeSession.problemSolvingScore || activeSession.overallScore || 0}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Project & Practical</span>
                  <span className="font-bold text-amber-400">{activeSession.projectScore || activeSession.technicalScore || 0}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${activeSession.projectScore || activeSession.technicalScore || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Strongest Demonstrated Skills
              </h3>
              <ul className="mt-4 space-y-2.5">
                {reportStrengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-400">
                <AlertCircle className="h-4 w-4" /> Areas Needing More Depth
              </h3>
              <ul className="mt-4 space-y-2.5">
                {reportWeaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions Answered Well vs Needing Improvement */}
          {(reportQuestionsWell.length > 0 || reportQuestionsImprove.length > 0) && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                  Questions Answered Well
                </h3>
                <ul className="space-y-2">
                  {reportQuestionsWell.map((q, idx) => (
                    <li key={idx} className="rounded-xl border border-emerald-500/10 bg-emerald-500/05 p-3 text-xs text-white/70">
                      ✓ {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
                  Questions Needing Improvement
                </h3>
                <ul className="space-y-2">
                  {reportQuestionsImprove.map((q, idx) => (
                    <li key={idx} className="rounded-xl border border-amber-500/10 bg-amber-500/05 p-3 text-xs text-white/70">
                      ⚠ {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Recommendations & Top 5 Topics to Study */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400">
              <BookOpen className="h-4 w-4" /> Top Priority Topics to Study Before Next Interview
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reportRecommendations.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs font-medium text-white/80"
                >
                  <Target className="h-4 w-4 shrink-0 text-blue-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {reportDsaTopics.length > 0 && (
              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <h4 className="text-xs font-semibold text-purple-400 mb-2">Recommended DSA Focus Areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {reportDsaTopics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 flex justify-end gap-3 border-t border-white/[0.06] pt-6">
              <button
                onClick={handleExitInterview}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <RotateCcw className="h-4 w-4" /> Start Another Session
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
