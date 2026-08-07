import { motion } from 'framer-motion'
import {
  Flame,
  Trophy,
  GitBranch,
  Code2,
  FileText,
  CalendarClock,
  Sparkles,
} from 'lucide-react'
import {
  HeroSection,
  PlacementScore,
  ResumeScoreCard,
  ATSScoreCard,
  GitHubScoreCard,
  LeetCodeScoreCard,
  ApplicationCard,
  InterviewCard,
  RoadmapProgress,
  WeeklyGoals,
  ActivityTimeline,
  RecommendationCard,
  SkillRadarChart,
  PlacementEmptyState,
} from '../components/analytics'
import { PLACEMENT_DASHBOARD_DATA } from '../data/analytics'
import { useAuth } from '../contexts/AuthContext'

const ACHIEVEMENT_ICONS: Record<string, typeof Flame> = {
  Flame,
  Trophy,
  GitBranch,
  Code2,
  FileText,
}

export function PlacementDashboardPage() {
  const { user } = useAuth()
  const data = PLACEMENT_DASHBOARD_DATA

  const statCards = [
    { key: 'resume', data: data.stats[0], Comp: ResumeScoreCard },
    { key: 'ats', data: data.stats[1], Comp: ATSScoreCard },
    { key: 'github', data: data.stats[2], Comp: GitHubScoreCard },
    { key: 'leetcode', data: data.stats[3], Comp: LeetCodeScoreCard },
    { key: 'apps', data: data.stats[4], Comp: ApplicationCard },
    { key: 'interview', data: data.stats[5], Comp: InterviewCard },
    { key: 'roadmap', data: data.stats[6], Comp: RoadmapProgress },
  ]

  const maxActivity = Math.max(...data.weeklyActivity.map((d) => d.value))
  const totalApplications = data.applicationStatus.reduce(
    (sum, s) => sum + s.count,
    0,
  )

  return (
    <div className="mx-auto max-w-7xl">
      {/* Top Hero */}
      <HeroSection data={data.score} userName={user?.fullName} />

      {/* Score + Stat cards */}
      <div className="mb-6 mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PlacementScore data={data.score} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-3">
          {statCards.map(({ key, data: d, Comp }) => (
            <Comp key={key} data={d} />
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <SkillRadarChart skills={data.skills} />

        {/* Weekly Activity */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
          <h3 className="mb-4 text-sm font-semibold text-white/90">
            Weekly Activity
          </h3>
          <div className="flex h-40 items-end justify-between gap-2">
            {data.weeklyActivity.map((d, i) => (
              <motion.div
                key={d.day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-[10px] text-white/40">{d.value}</span>
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-blue-500/40 to-indigo-500/80"
                  initial={{ height: 0 }}
                  animate={{
                    height: `${Math.max(12, (d.value / maxActivity) * 100)}%`,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.06,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                />
                <span className="text-[10px] text-white/40">{d.day}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Application Status */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
          <h3 className="mb-4 text-sm font-semibold text-white/90">
            Application Status
          </h3>
          <div className="space-y-3">
            {data.applicationStatus.map((s, i) => {
              const pct = Math.round((s.count / totalApplications) * 100)
              return (
                <div key={s.status}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-white/60">{s.status}</span>
                    <span className="text-white/40">
                      {s.count} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className={`h-full rounded-full ${s.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(6, pct)}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.1 + i * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Goals + Timeline + Recommendations */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <WeeklyGoals goals={data.weeklyGoals} />
        <ActivityTimeline activities={data.activities} />
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendationCard recommendations={data.recommendations} />
        </div>

        {/* Deadlines */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/14 ring-1 ring-amber-500/20">
              <CalendarClock className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/90">
              Upcoming Deadlines
            </h3>
          </div>
          <div className="space-y-2.5">
            {data.deadlines.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.06,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-semibold ${d.color}`}>
                    {d.company.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/85">
                      {d.company}
                    </p>
                    <p className="text-xs text-white/40">
                      {d.role} · {d.date}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/40 ring-1 ring-white/[0.08]">
                  {d.daysLeft}d left
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/14 ring-1 ring-orange-500/20">
            <Sparkles className="h-4 w-4 text-orange-400" />
          </div>
          <h3 className="text-sm font-semibold text-white/90">
            Recent Achievements
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {data.achievements.map((a, i) => {
            const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Flame
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.06,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-colors duration-200 hover:bg-white/[0.05]"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]">
                  <Icon className={`h-4 w-4 ${a.color}`} />
                </div>
                <p className="text-sm font-medium text-white/85">{a.title}</p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {a.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Empty state */}
      <PlacementEmptyState />
    </div>
  )
}
