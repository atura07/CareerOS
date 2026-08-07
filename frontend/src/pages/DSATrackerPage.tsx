import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import {
  OverallProgress,
  DailyActivity,
  SheetTracker,
  TopicProgressGrid,
  DifficultyChart,
  SolvedVsPending,
  RevisionPlanner,
  RecentActivity,
  BookmarkedProblems,
  AchievementBadges,
  StudyCalendar,
  WeeklyGoals,
  EmptyState,
} from '../components/dsa'
import {
  DSA_STATS,
  TOPIC_PROGRESS,
  LOVE_BABBAR_SHEET,
  STRIVER_A2Z_SHEET,
  DIFFICULTY_DISTRIBUTION,
  ACTIVITY_HEATMAP,
  REVISION_PLANNER,
  RECENT_ACTIVITY,
  BOOKMARKS,
  ACHIEVEMENTS,
  CALENDAR_EVENTS,
  WEEKLY_GOALS,
} from '../data/dsa'

export function DSATrackerPage() {
  const completedGoals = WEEKLY_GOALS.filter((g) => g.done).length
  const stats = DSA_STATS

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          <Code2 className="h-7 w-7 text-cyan-400" />
          DSA Tracker
        </div>
        <p className="mt-1 text-sm text-white/50">
          Track your problem-solving progress, sheets, streaks, and revision schedule.
        </p>
      </motion.div>

      {/* Overall progress */}
      <div className="mb-6">
        <OverallProgress stats={stats} />
      </div>

      {/* Daily activity + solved vs pending */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DailyActivity data={ACTIVITY_HEATMAP} stats={stats} />
        </div>
        <div>
          <SolvedVsPending
            solved={stats.solvedProblems}
            pending={stats.totalProblems - stats.solvedProblems}
          />
        </div>
      </div>

      {/* Sheets */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <SheetTracker sheet={LOVE_BABBAR_SHEET} />
        <SheetTracker sheet={STRIVER_A2Z_SHEET} />
      </div>

      {/* Topic progress */}
      <div className="mb-6">
        <h3 className="mb-4 text-sm font-semibold text-white/90">Topic Progress</h3>
        <TopicProgressGrid topics={TOPIC_PROGRESS} />
      </div>

      {/* Difficulty + revision + weekly goals */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <DifficultyChart data={DIFFICULTY_DISTRIBUTION} />
        <RevisionPlanner items={REVISION_PLANNER} />
        <WeeklyGoals goals={WEEKLY_GOALS} completed={completedGoals} total={WEEKLY_GOALS.length} />
      </div>

      {/* Recent activity + bookmarks */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <RecentActivity items={RECENT_ACTIVITY} />
        <BookmarkedProblems items={BOOKMARKS} />
      </div>

      {/* Achievements + calendar */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <AchievementBadges achievements={ACHIEVEMENTS} />
        <StudyCalendar events={CALENDAR_EVENTS} />
      </div>

      {/* Empty state demo */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white/90">Empty State</h3>
        <EmptyState />
      </div>
    </div>
  )
}
