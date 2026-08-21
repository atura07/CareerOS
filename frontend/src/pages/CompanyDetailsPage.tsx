import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Coins,
  ArrowLeft,
  Briefcase,
  Layers,
  BookOpen,
  CheckCircle2,
  Circle,
  Sparkles,
  ExternalLink,
  Loader2,
  Clock,
  Mic,
} from 'lucide-react'
import {
  getCompanyBySlug,
  getUserCompanyPrep,
  startCompanyPrep,
  toggleCompanyPrepTask,
  type CompanyDetail,
  type UserCompanyPrep,
} from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  Hard: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
}

const PRIORITY_STYLES: Record<string, string> = {
  High: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  Low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
}

export function CompanyDetailsPage() {
  const { id: slug } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()

  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [prep, setPrep] = useState<UserCompanyPrep | null>(null)
  const [loading, setLoading] = useState(true)
  const [prepActionLoading, setPrepActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let isMounted = true

    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const companyData = await getCompanyBySlug(slug)
        if (isMounted) setCompany(companyData)

        if (isAuthenticated) {
          try {
            const userPrep = await getUserCompanyPrep(slug)
            if (isMounted) setPrep(userPrep)
          } catch (e) {
            console.error('Failed to load user preparation:', e)
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || 'Failed to load company details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [slug, isAuthenticated])

  const handleStartPrep = async () => {
    if (!slug) return
    setPrepActionLoading(true)
    try {
      const updated = await startCompanyPrep(slug)
      setPrep(updated)
    } catch (err: any) {
      console.error('Failed to start preparation:', err)
    } finally {
      setPrepActionLoading(false)
    }
  }

  const handleToggleTask = async (topicId: number) => {
    if (!slug) return
    try {
      const updated = await toggleCompanyPrepTask(slug, topicId)
      setPrep(updated)
    } catch (err: any) {
      console.error('Failed to toggle task:', err)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="mt-3 text-sm font-medium text-white/60">Loading company preparation track...</p>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/05 p-10 text-center">
          <p className="text-base font-semibold text-rose-300">{error || 'Company not found'}</p>
          <Link
            to="/dashboard/companies"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/[0.12]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Companies
          </Link>
        </div>
      </div>
    )
  }

  const completedMap = new Map<number, boolean>()
  if (prep?.tasks) {
    prep.tasks.forEach((t) => {
      completedMap.set(t.topicId, t.status === 'COMPLETED')
    })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          to="/dashboard/companies"
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Companies
        </Link>
      </motion.div>

      {/* Hero Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-2xl font-bold text-blue-400 ring-1 ring-blue-500/30">
              {company.logoUrl || company.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white/95 sm:text-3xl">
                  {company.name}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    DIFFICULTY_STYLES[company.difficulty] || 'text-amber-400'
                  }`}
                >
                  {company.difficulty} Difficulty
                </span>
                {company.industry && (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/60">
                    {company.industry}
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
                {company.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  {company.location || 'Multiple Hubs'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-emerald-400" />
                  {company.packageInfo || 'Competitive Compensation'}
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Careers Portal <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row md:flex-col">
            <Link
              to={`/dashboard/interview?company=${company.id}&name=${encodeURIComponent(company.name)}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              <Mic className="h-4 w-4" /> Start AI Mock Interview
            </Link>
          </div>
        </div>
      </motion.div>

      {/* User Preparation Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h2 className="text-base font-semibold tracking-tight text-white/90">
                Your Preparation Status
              </h2>
            </div>
            <p className="mt-1 text-xs text-white/50">
              {prep
                ? `${prep.completedTasksCount} of ${prep.totalTasksCount} topics mastered. Progress is calculated from verified task completion.`
                : 'Begin tracking your placement preparation journey for this company.'}
            </p>
          </div>

          {!prep ? (
            <button
              onClick={handleStartPrep}
              disabled={prepActionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500/14 px-4 py-2.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 disabled:opacity-50"
            >
              {prepActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Start Preparation Track
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-400">{prep.progressPercentage}%</span>
                <span className="block text-[10px] uppercase tracking-wider text-white/40">Mastered</span>
              </div>
            </div>
          )}
        </div>

        {prep && (
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-500"
                style={{ width: `${prep.progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Roles & Interview Process (1 col) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Open Roles */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-semibold tracking-tight text-white/90">Hiring Roles</h3>
            </div>
            <div className="space-y-3">
              {company.roles && company.roles.length > 0 ? (
                company.roles.map((role) => (
                  <div key={role.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <h4 className="text-xs font-semibold text-white/90">{role.title}</h4>
                    <p className="mt-1 text-[11px] text-white/50">{role.experienceLevel} · {role.location || 'India'}</p>
                    {role.eligibilityInfo && (
                      <p className="mt-1.5 text-[11px] text-white/40">{role.eligibilityInfo}</p>
                    )}
                    {role.requiredSkills && role.requiredSkills.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {role.requiredSkills.map((s) => (
                          <span key={s} className="rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/40">General Software Engineering Track</p>
              )}
            </div>
          </div>

          {/* Interview Workflow Rounds */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold tracking-tight text-white/90">Hiring Rounds</h3>
            </div>
            <div className="space-y-4">
              {company.interviewProcesses && company.interviewProcesses.length > 0 ? (
                company.interviewProcesses.map((proc) => (
                  <div key={proc.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-[2px] before:bg-white/[0.06] last:before:hidden">
                    <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 ring-1 ring-blue-500/40 text-[9px] font-bold text-blue-400">
                      {proc.roundNumber}
                    </div>
                    <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-white/90">{proc.roundName}</h4>
                        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] font-medium text-white/60">
                          {proc.roundType}
                        </span>
                      </div>
                      {proc.description && (
                        <p className="mt-1 text-[11px] leading-relaxed text-white/50">{proc.description}</p>
                      )}
                      {proc.preparationRequirements && (
                        <p className="mt-1.5 rounded-lg bg-blue-500/05 p-2 text-[10px] text-blue-300/80 border border-blue-500/10">
                          💡 <span className="font-medium">Key Focus:</span> {proc.preparationRequirements}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/40">Standard technical assessment workflow</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Company Preparation Topics (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <h3 className="text-base font-semibold tracking-tight text-white/90">
                  Targeted Preparation Topics
                </h3>
              </div>
              <span className="text-xs text-white/40">
                Click checkboxes to mark topics complete
              </span>
            </div>

            <div className="space-y-3">
              {company.prepTopics && company.prepTopics.length > 0 ? (
                company.prepTopics.map((topic) => {
                  const isCompleted = completedMap.get(topic.id) || false
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleToggleTask(topic.id)}
                      className={`group flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                        isCompleted
                          ? 'border-emerald-500/30 bg-emerald-500/05'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 text-white/40 transition-colors group-hover:text-blue-400"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-white/30" />
                          )}
                        </button>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-white/90">{topic.topic}</span>
                            <span className="rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-400">
                              {topic.subject}
                            </span>
                          </div>
                          {topic.estimatedEffort && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-white/40">
                              <Clock className="h-3 w-3" /> Effort: {topic.estimatedEffort}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            PRIORITY_STYLES[topic.priority] || 'text-white/60'
                          }`}
                        >
                          {topic.priority} Priority
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-xs text-white/40">No specific preparation topics listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
