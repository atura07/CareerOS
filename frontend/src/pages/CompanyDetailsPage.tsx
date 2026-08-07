import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  GraduationCap,
  Coins,
  ArrowLeft,
  FileText,
  Code2,
  Users,
  BookOpen,
  Target,
  Lightbulb,
  CalendarRange,
  ListChecks,
} from 'lucide-react'
import { COMPANIES } from '../data/companies'
import type { Company, CompanyStatus } from '../data/companies'

const STATUS_STYLES: Record<CompanyStatus, string> = {
  Open: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
  Upcoming: 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  Closed: 'border-rose-500/30 bg-rose-500/14 text-rose-400',
}

const DIFFICULTY_STYLES: Record<Company['difficulty'], string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

interface DetailSectionProps {
  icon: React.ReactNode
  title: string
  items: string[]
}

function DetailSection({ icon, title, items }: DetailSectionProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
          {icon}
        </div>
        <h3 className="text-sm font-semibold tracking-tight text-white/90">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-white/60">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const company = COMPANIES.find((c) => c.id === id)

  if (!company) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
            <FileText className="h-6 w-6 text-white/30" />
          </div>
          <p className="text-sm font-medium text-white/60">Company not found</p>
          <p className="mt-1 text-xs text-white/40">
            The company you are looking for does not exist.
          </p>
          <Link
            to="/dashboard/companies"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-500/14 px-4 py-2 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/25 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Companies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-6"
      >
        <Link
          to="/dashboard/companies"
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Companies
        </Link>
      </motion.div>

      {/* Company header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Logo + name */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-2xl font-bold text-blue-400 ring-1 ring-blue-500/20">
              {company.logo}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                {company.name}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/40">
                <MapPin className="h-3.5 w-3.5" /> {company.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[company.status]}`}
            >
              {company.status}
            </span>
            <span
              className={`inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium ${DIFFICULTY_STYLES[company.difficulty]}`}
            >
              {company.difficulty}
            </span>
          </div>
        </div>

        {/* Key stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
              <Coins className="h-3 w-3" /> Package
            </p>
            <p className="mt-1 text-base font-semibold text-emerald-400">{company.package}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
              <GraduationCap className="h-3 w-3" /> Min CGPA
            </p>
            <p className="mt-1 text-base font-semibold text-white/80">{company.minimumCGPA}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
              <Target className="h-3 w-3" /> Difficulty
            </p>
            <p className={`mt-1 text-base font-semibold ${DIFFICULTY_STYLES[company.difficulty]}`}>
              {company.difficulty}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
              <ListChecks className="h-3 w-3" /> Hiring Status
            </p>
            <p className={`mt-1 text-base font-semibold ${DIFFICULTY_STYLES[company.difficulty]}`}>
              {company.status}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Skills + Hiring process */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8 grid gap-4 lg:grid-cols-2"
      >
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90">
            <Code2 className="h-4 w-4 text-blue-400" /> Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {company.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90">
            <ListChecks className="h-4 w-4 text-blue-400" /> Hiring Process
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {company.hiringProcess.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70">
                  {step}
                </span>
                {i < company.hiringProcess.length - 1 && (
                  <span className="text-white/30">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detail sections */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="grid gap-4 md:grid-cols-2"
      >
        <DetailSection
          icon={<FileText className="h-4 w-4 text-blue-400" />}
          title="Online Assessment Pattern"
          items={company.onlineAssessment}
        />
        <DetailSection
          icon={<Code2 className="h-4 w-4 text-blue-400" />}
          title="Technical Interview Topics"
          items={company.technicalInterview}
        />
        <DetailSection
          icon={<Users className="h-4 w-4 text-blue-400" />}
          title="HR Interview Questions"
          items={company.hrQuestions}
        />
        <DetailSection
          icon={<BookOpen className="h-4 w-4 text-blue-400" />}
          title="Preparation Resources"
          items={company.resources}
        />
        <DetailSection
          icon={<Target className="h-4 w-4 text-blue-400" />}
          title="Recommended DSA Topics"
          items={company.dsaTopics}
        />
        <DetailSection
          icon={<Lightbulb className="h-4 w-4 text-blue-400" />}
          title="Resume Tips for this Company"
          items={company.resumeTips}
        />
        <DetailSection
          icon={<CalendarRange className="h-4 w-4 text-blue-400" />}
          title="Application Timeline"
          items={company.applicationTimeline}
        />
      </motion.div>
    </div>
  )
}
