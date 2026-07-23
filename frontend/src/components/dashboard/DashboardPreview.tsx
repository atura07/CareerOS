import { motion } from 'framer-motion'
import {
  TrendingUp,
  Award,
  BrainCircuit,
  Clock,
  Zap,
  CheckCircle2,
  Briefcase,
  Target,
} from 'lucide-react'

/* ─── Animation variants ─── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

/* ─── Stats data ─── */

const stats = [
  { label: 'Applications Sent', value: '24', icon: Briefcase, color: 'text-blue-400' },
  { label: 'Interviews Scheduled', value: '8', icon: Target, color: 'text-emerald-400' },
  { label: 'Offers Received', value: '3', icon: Award, color: 'text-amber-400' },
]

/* ─── DSA weekly data ─── */

const dsaWeeklyData = [
  { day: 'Mon', solved: 5, total: 8 },
  { day: 'Tue', solved: 7, total: 10 },
  { day: 'Wed', solved: 4, total: 7 },
  { day: 'Thu', solved: 9, total: 12 },
  { day: 'Fri', solved: 6, total: 9 },
  { day: 'Sat', solved: 8, total: 10 },
  { day: 'Sun', solved: 3, total: 6 },
]

/* ─── Recent Activity ─── */

const recentActivity = [
  { text: 'Resume score improved to 92%', time: '2h ago', type: 'success' },
  { text: 'Completed DP practice set', time: '5h ago', type: 'info' },
  { text: 'ATS optimized for Google SDE', time: '1d ago', type: 'info' },
  { text: 'Mock interview score: 85%', time: '2d ago', type: 'success' },
  { text: 'Added Amazon to target companies', time: '3d ago', type: 'info' },
]

/* ─── AI Suggestions ─── */

const aiSuggestions = [
  {
    icon: Zap,
    text: 'Your DSA progress is strong in Arrays & Strings. Focus on Dynamic Programming this week.',
    type: 'tip',
  },
  {
    icon: BrainCircuit,
    text: 'Resume ATS score can be improved by adding more SQL keywords.',
    type: 'action',
  },
]

/* ─── Dashboard Preview Section ─── */

export function DashboardPreview() {
  return (
    <section
      className="relative overflow-hidden bg-[#05070c] px-5 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8"
      aria-labelledby="dashboard-heading"
    >
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),rgba(99,102,241,0.04),transparent)]" />
        <div className="absolute bottom-0 left-1/2 h-[320px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.06),transparent)]" />
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium tracking-widest text-white/40 uppercase">
          Live Dashboard
        </p>
        <h2
          id="dashboard-heading"
          className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white/90 sm:text-4xl md:text-5xl"
        >
          Your placement command center
        </h2>
        <p className="mt-4 text-balance text-base leading-relaxed text-white/60 sm:text-lg">
          Real-time insights, AI-powered suggestions, and a clear view of your
          placement journey — all in one place.
        </p>
      </motion.div>

      {/* Dashboard mock */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mx-auto mt-14 max-w-7xl"
      >
        {/* Glass mock dashboard container */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-2xl sm:p-6 lg:p-8">
          {/* Inner glow overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-30"
            style={{
              background:
                'radial-gradient(480px at 20% 20%, rgba(59,130,246,0.06), transparent)',
            }}
          />

          {/* Dashboard header bar */}
          <div className="relative mb-6 flex items-center justify-between border-b border-white/[0.06] pb-4 sm:mb-8 sm:pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30">
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">
                  Placement Dashboard
                </h3>
                <p className="text-xs text-white/40">Last updated 2 min ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden h-2 w-2 rounded-full bg-emerald-400 sm:inline-flex" />
              <span className="hidden text-xs text-white/50 sm:inline">
                Live
              </span>
            </div>
          </div>

          {/* ─── Row 1: Statistics cards ─── */}
          <motion.div
            variants={itemVariants}
            className="relative mb-6 grid grid-cols-3 gap-3 sm:gap-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-[1px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className={`h-4 w-4 ${stat.color} transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100`}
                    />
                    <span className="text-lg font-semibold tracking-tight text-white/90 sm:text-2xl">
                      {stat.value}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/50 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </motion.div>

          {/* ─── Row 2: DSA Progress + Score Cards ─── */}
          <div className="relative mb-6 grid gap-4 sm:mb-8 sm:grid-cols-5 sm:gap-5">
            {/* DSA Progress Chart — spans 3 cols */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-3"
            >
              <div className="group h-full rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-[1px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] motion-reduce:transition-none sm:p-5">
                <h4 className="mb-4 text-xs font-semibold tracking-wide text-white/70 sm:text-sm">
                  DSA Progress
                </h4>
                {/* Bar chart — pure CSS */}
                <div className="flex items-end justify-between gap-2 sm:gap-3">
                  {dsaWeeklyData.map((day) => {
                    const maxHeight = 80
                    const solvedH = (day.solved / day.total) * maxHeight
                    const totalH = maxHeight
                    return (
                      <div
                        key={day.day}
                        className="flex flex-1 flex-col items-center gap-1.5"
                      >
                        {/* Stacked bar */}
                        <div className="relative flex w-full items-end justify-center sm:gap-0.5">
                          {/* total bar bg */}
                          <div
                            className="w-full rounded-t border border-white/[0.04] bg-white/[0.03]"
                            style={{ height: `${totalH}px` }}
                          >
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-blue-500/40 to-blue-400/60 transition-all duration-500"
                              style={{ height: `${solvedH}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-white/40 sm:text-xs">
                          {day.day.slice(0, 3)}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {/* Legend */}
                <div className="mt-3 flex items-center gap-4 text-[10px] text-white/40 sm:mt-4 sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-blue-400/60" />
                    Solved
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm border border-white/[0.12] bg-white/[0.03]" />
                    Planned
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column: Resume Score + ATS Score stacked */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 sm:col-span-2 sm:gap-5"
            >
              {/* Resume Score */}
              <ScoreCard
                title="Resume Score"
                value={92}
                max={100}
                color="text-blue-400"
                strokeColor="#60a5fa"
                trackColor="rgba(59,130,246,0.12)"
                detail="Strong match"
                detailColor="text-emerald-400"
              />
              {/* ATS Score */}
              <ScoreCard
                title="ATS Score"
                value={78}
                max={100}
                color="text-amber-400"
                strokeColor="#fbbf24"
                trackColor="rgba(251,191,36,0.12)"
                detail="Needs optimization"
                detailColor="text-amber-400"
              />
            </motion.div>
          </div>

          {/* ─── Row 3: Recent Activity + AI Suggestions ─── */}
          <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-5">
            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-[1px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] motion-reduce:transition-none sm:p-5">
                <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-wide text-white/70 sm:text-sm">
                  <Clock className="h-3.5 w-3.5 text-white/40" />
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                          activity.type === 'success'
                            ? 'text-emerald-400'
                            : 'text-blue-400'
                        }`}
                      />
                      <div className="flex flex-1 items-start justify-between gap-2">
                        <p className="text-xs leading-relaxed text-white/70 sm:text-sm">
                          {activity.text}
                        </p>
                        <span className="shrink-0 text-[10px] text-white/30 sm:text-xs">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Suggestions */}
            <motion.div variants={itemVariants}>
              <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-[1px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] motion-reduce:transition-none sm:p-5">
                <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-wide text-white/70 sm:text-sm">
                  <BrainCircuit className="h-3.5 w-3.5 text-blue-400" />
                  AI Suggestions
                </h4>
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, i) => {
                    const Icon = suggestion.icon
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors duration-200 hover:border-white/[0.08] hover:bg-white/[0.04]"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
                          <Icon className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <p className="text-xs leading-relaxed text-white/60 sm:text-sm">
                          {suggestion.text}
                        </p>
                      </div>
                    )
                  })}
                </div>
                <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]">
                  View all suggestions
                  <span aria-hidden>&rarr;</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── SVG Radial Score Card ─── */

function ScoreCard({
  title,
  value,
  max,
  color,
  strokeColor,
  trackColor,
  detail,
  detailColor,
}: {
  title: string
  value: number
  max: number
  color: string
  strokeColor: string
  trackColor: string
  detail: string
  detailColor: string
}) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const percentage = value / max
  const offset = circumference * (1 - percentage)

  return (
    <div className="group flex flex-1 flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-[1px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] motion-reduce:transition-none sm:p-5">
      <h4 className="mb-3 text-xs font-semibold tracking-wide text-white/70 sm:text-sm">
        {title}
      </h4>
      {/* SVG Radial Progress */}
      <div className="relative mb-3 flex items-center justify-center">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          className="-rotate-90"
          aria-hidden
        >
          {/* Track circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="5"
          />
          {/* Progress arc */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span
          className={`absolute text-xl font-bold tracking-tight sm:text-2xl ${color}`}
        >
          {value}
          <span className="text-xs font-medium text-white/30 sm:text-sm">
            /{max}
          </span>
        </span>
      </div>
      <p
        className={`text-[11px] font-medium tracking-wide sm:text-xs ${detailColor}`}
      >
        {detail}
      </p>
    </div>
  )
}

