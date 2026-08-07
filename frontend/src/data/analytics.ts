export interface ReadinessCategory {
  label: string
  score: number
  color: string
}

export interface Kpi {
  label: string
  value: string | number
  delta: string
  trend: 'up' | 'down' | 'neutral'
  icon: string
  color: string
}

export interface WeeklyPoint {
  week: string
  applications: number
  interviews: number
  offers: number
}

export interface MonthlyPoint {
  month: string
  applications: number
  offers: number
}

export interface ContributionPoint {
  date: string
  count: number
}

export interface TrendPoint {
  label: string
  value: number
}

export interface InterviewPerformance {
  round: string
  passed: number
  total: number
}

export interface ApplicationStat {
  status: string
  count: number
  color: string
}

export interface ResumeImprovementPoint {
  version: string
  atsScore: number
}

export interface HeatmapDay {
  day: number
  level: number
}

export interface AnalyticsData {
  readiness: {
    overall: number
    categories: ReadinessCategory[]
  }
  kpis: Kpi[]
  weekly: WeeklyPoint[]
  monthly: MonthlyPoint[]
  githubContributions: ContributionPoint[]
  leetCodeTrend: TrendPoint[]
  dsaTrend: TrendPoint[]
  atsTrend: TrendPoint[]
  interviewPerformance: InterviewPerformance[]
  applicationStats: ApplicationStat[]
  resumeImprovement: ResumeImprovementPoint[]
  heatmap: HeatmapDay[]
}

export const ANALYTICS_DATA: AnalyticsData = {
  readiness: {
    overall: 78,
    categories: [
      { label: 'DSA', score: 82, color: 'from-blue-500 to-indigo-500' },
      { label: 'Resume', score: 76, color: 'from-emerald-500 to-teal-500' },
      { label: 'Applications', score: 70, color: 'from-amber-500 to-orange-500' },
      { label: 'Interviews', score: 84, color: 'from-violet-500 to-purple-500' },
    ],
  },
  kpis: [
    { label: 'Total Applications', value: 20, delta: '+4 this week', trend: 'up', icon: 'Send', color: 'text-blue-400' },
    { label: 'Active Applications', value: 12, delta: 'in progress', trend: 'neutral', icon: 'Activity', color: 'text-emerald-400' },
    { label: 'Offers', value: 2, delta: '1 this month', trend: 'up', icon: 'Award', color: 'text-amber-400' },
    { label: 'Interviews', value: 8, delta: '2 upcoming', trend: 'up', icon: 'Mic', color: 'text-violet-400' },
  ],
  weekly: [
    { week: 'W1', applications: 4, interviews: 1, offers: 0 },
    { week: 'W2', applications: 6, interviews: 2, offers: 0 },
    { week: 'W3', applications: 5, interviews: 2, offers: 1 },
    { week: 'W4', applications: 5, interviews: 3, offers: 1 },
  ],
  monthly: [
    { month: 'May', applications: 8, offers: 1 },
    { month: 'Jun', applications: 12, offers: 1 },
    { month: 'Jul', applications: 16, offers: 2 },
    { month: 'Aug', applications: 20, offers: 2 },
  ],
  githubContributions: [
    { date: '01 Aug', count: 2 },
    { date: '04 Aug', count: 4 },
    { date: '07 Aug', count: 3 },
    { date: '10 Aug', count: 6 },
    { date: '13 Aug', count: 5 },
    { date: '16 Aug', count: 8 },
    { date: '19 Aug', count: 7 },
    { date: '22 Aug', count: 10 },
  ],
  leetCodeTrend: [
    { label: 'W1', value: 12 },
    { label: 'W2', value: 18 },
    { label: 'W3', value: 26 },
    { label: 'W4', value: 34 },
    { label: 'W5', value: 42 },
    { label: 'W6', value: 51 },
  ],
  dsaTrend: [
    { label: 'W1', value: 40 },
    { label: 'W2', value: 48 },
    { label: 'W3', value: 55 },
    { label: 'W4', value: 63 },
    { label: 'W5', value: 70 },
    { label: 'W6', value: 78 },
  ],
  atsTrend: [
    { label: 'v1', value: 67 },
    { label: 'v2', value: 76 },
    { label: 'v3', value: 82 },
  ],
  interviewPerformance: [
    { round: 'Technical', passed: 6, total: 8 },
    { round: 'HR', passed: 3, total: 4 },
    { round: 'Managerial', passed: 2, total: 3 },
    { round: 'System Design', passed: 1, total: 2 },
  ],
  applicationStats: [
    { status: 'Applied', count: 4, color: 'bg-blue-500' },
    { status: 'OA Scheduled', count: 3, color: 'bg-violet-500' },
    { status: 'OA Cleared', count: 3, color: 'bg-indigo-500' },
    { status: 'Technical Interview', count: 4, color: 'bg-amber-500' },
    { status: 'HR Interview', count: 2, color: 'bg-orange-500' },
    { status: 'Offer', count: 2, color: 'bg-emerald-500' },
    { status: 'Rejected', count: 2, color: 'bg-rose-500' },
  ],
  resumeImprovement: [
    { version: 'v1', atsScore: 67 },
    { version: 'v2', atsScore: 76 },
    { version: 'v3', atsScore: 82 },
  ],
heatmap: [
    { day: 1, level: 1 }, { day: 2, level: 0 }, { day: 3, level: 2 },
    { day: 4, level: 3 }, { day: 5, level: 1 }, { day: 6, level: 0 },
    { day: 7, level: 2 }, { day: 8, level: 4 }, { day: 9, level: 3 },
    { day: 10, level: 2 }, { day: 11, level: 1 }, { day: 12, level: 3 },
    { day: 13, level: 4 }, { day: 14, level: 2 }, { day: 15, level: 1 },
    { day: 16, level: 0 }, { day: 17, level: 2 }, { day: 18, level: 3 },
    { day: 19, level: 4 }, { day: 20, level: 2 }, { day: 21, level: 1 },
    { day: 22, level: 3 }, { day: 23, level: 2 }, { day: 24, level: 4 },
    { day: 25, level: 3 }, { day: 26, level: 2 }, { day: 27, level: 1 },
    { day: 28, level: 3 }, { day: 29, level: 4 }, { day: 30, level: 2 },
  ],
}

/* ---------------------------------------------------------------------------
 * Sprint 8 — Placement Readiness Dashboard (mock data)
 * ------------------------------------------------------------------------- */

export interface PlacementScoreCategory {
  label: string
  score: number
  color: string
}

export interface PlacementScoreData {
  overall: number
  readiness: number
  streak: number
  targetCompany: string
  categories: PlacementScoreCategory[]
}

export interface PlacementStatCard {
  title: string
  score: number
  value: string | number
  subtitle: string
  icon: string
  color: string
}

export interface SkillRadarItem {
  skill: string
  value: number
}

export interface WeeklyActivityPoint {
  day: string
  value: number
}

export interface ApplicationStatusChartItem {
  status: string
  count: number
  color: string
}

export interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

export interface WeeklyGoal {
  id: string
  label: string
  current: number
  target: number
  unit: string
  icon: string
  color: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  impact: string
  icon: string
  color: string
}

export interface Deadline {
  id: string
  company: string
  role: string
  date: string
  daysLeft: number
  color: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export interface PlacementDashboardData {
  score: PlacementScoreData
  stats: PlacementStatCard[]
  skills: SkillRadarItem[]
  weeklyActivity: WeeklyActivityPoint[]
  applicationStatus: ApplicationStatusChartItem[]
  activities: ActivityItem[]
  weeklyGoals: WeeklyGoal[]
  recommendations: Recommendation[]
  deadlines: Deadline[]
  achievements: Achievement[]
}

export const PLACEMENT_DASHBOARD_DATA: PlacementDashboardData = {
  score: {
    overall: 78,
    readiness: 82,
    streak: 7,
    targetCompany: 'Google',
    categories: [
      { label: 'Resume', score: 76, color: 'from-emerald-500 to-teal-500' },
      { label: 'DSA', score: 82, color: 'from-blue-500 to-indigo-500' },
      { label: 'GitHub', score: 68, color: 'from-slate-400 to-slate-600' },
      { label: 'LeetCode', score: 74, color: 'from-amber-500 to-orange-500' },
      { label: 'Applications', score: 70, color: 'from-violet-500 to-purple-500' },
      { label: 'Interviews', score: 84, color: 'from-cyan-500 to-sky-500' },
    ],
  },
  stats: [
    { title: 'Resume Score', score: 76, value: 'A-', subtitle: 'Strong resume', icon: 'FileText', color: 'text-emerald-400' },
    { title: 'ATS Score', score: 82, value: '82%', subtitle: '+6% this month', icon: 'BarChart3', color: 'text-blue-400' },
    { title: 'GitHub Score', score: 68, value: '68%', subtitle: '1,024 contributions', icon: 'GitBranch', color: 'text-slate-300' },
    { title: 'LeetCode Score', score: 74, value: '74%', subtitle: '150 problems solved', icon: 'Code2', color: 'text-amber-400' },
    { title: 'Applications', score: 70, value: '20', subtitle: '12 active', icon: 'Briefcase', color: 'text-violet-400' },
    { title: 'Interview Score', score: 84, value: '84%', subtitle: '8 interviews', icon: 'Mic', color: 'text-cyan-400' },
    { title: 'Roadmap Progress', score: 62, value: '62%', subtitle: 'Week 8 of 12', icon: 'Map', color: 'text-rose-400' },
    { title: 'Projects', score: 80, value: '5', subtitle: '2 featured', icon: 'FolderGit2', color: 'text-emerald-400' },
  ],
  skills: [
    { skill: 'DSA', value: 82 },
    { skill: 'System Design', value: 64 },
    { skill: 'Frontend', value: 78 },
    { skill: 'Backend', value: 72 },
    { skill: 'DevOps', value: 55 },
    { skill: 'Communication', value: 85 },
  ],
  weeklyActivity: [
    { day: 'Mon', value: 4 },
    { day: 'Tue', value: 6 },
    { day: 'Wed', value: 3 },
    { day: 'Thu', value: 8 },
    { day: 'Fri', value: 5 },
    { day: 'Sat', value: 7 },
    { day: 'Sun', value: 2 },
  ],
  applicationStatus: [
    { status: 'Applied', count: 4, color: 'bg-blue-500' },
    { status: 'OA Scheduled', count: 3, color: 'bg-violet-500' },
    { status: 'OA Cleared', count: 3, color: 'bg-indigo-500' },
    { status: 'Technical Interview', count: 4, color: 'bg-amber-500' },
    { status: 'HR Interview', count: 2, color: 'bg-orange-500' },
    { status: 'Offer', count: 2, color: 'bg-emerald-500' },
    { status: 'Rejected', count: 2, color: 'bg-rose-500' },
  ],
  activities: [
    { id: 'a1', type: 'resume', title: 'Resume Uploaded', description: 'resume_v4.pdf uploaded', timestamp: '2h ago', icon: 'FileText', color: 'text-emerald-400' },
    { id: 'a2', type: 'ats', title: 'ATS Completed', description: 'ATS score improved to 82%', timestamp: '5h ago', icon: 'BarChart3', color: 'text-blue-400' },
    { id: 'a3', type: 'leetcode', title: 'LeetCode Solved', description: 'Solved 3 medium problems', timestamp: '1d ago', icon: 'Code2', color: 'text-amber-400' },
    { id: 'a4', type: 'github', title: 'GitHub Commit', description: 'Pushed 6 commits to projects', timestamp: '1d ago', icon: 'GitBranch', color: 'text-slate-300' },
    { id: 'a5', type: 'interview', title: 'Interview Completed', description: 'Technical round at Amazon', timestamp: '2d ago', icon: 'Mic', color: 'text-cyan-400' },
    { id: 'a6', type: 'application', title: 'Application Submitted', description: 'Applied to Adobe & Flipkart', timestamp: '3d ago', icon: 'Briefcase', color: 'text-violet-400' },
  ],
  weeklyGoals: [
    { id: 'g1', label: 'Solve 15 LeetCode', current: 9, target: 15, unit: 'problems', icon: 'Code2', color: 'text-amber-400' },
    { id: 'g2', label: 'Push 5 GitHub Commits', current: 3, target: 5, unit: 'commits', icon: 'GitBranch', color: 'text-slate-300' },
    { id: 'g3', label: 'Complete 2 Interviews', current: 1, target: 2, unit: 'interviews', icon: 'Mic', color: 'text-cyan-400' },
    { id: 'g4', label: 'Apply to 3 Companies', current: 2, target: 3, unit: 'companies', icon: 'Briefcase', color: 'text-violet-400' },
    { id: 'g5', label: 'Improve ATS by 10%', current: 6, target: 10, unit: 'points', icon: 'BarChart3', color: 'text-blue-400' },
  ],
  recommendations: [
    { id: 'r1', title: 'Improve Resume', description: 'Add measurable impact metrics to your work experience.', priority: 'high', impact: '+4 ATS', icon: 'FileText', color: 'text-emerald-400' },
    { id: 'r2', title: 'Add Spring Boot Project', description: 'A backend project would round out your portfolio.', priority: 'high', impact: '+3 GitHub', icon: 'FolderGit2', color: 'text-slate-300' },
    { id: 'r3', title: 'Increase GitHub Activity', description: 'Commit daily to build a stronger contribution graph.', priority: 'medium', impact: '+5 GitHub', icon: 'GitBranch', color: 'text-slate-300' },
    { id: 'r4', title: 'Solve More Medium Problems', description: 'Focus on medium-difficulty DSA problems this week.', priority: 'medium', impact: '+6 LeetCode', icon: 'Code2', color: 'text-amber-400' },
    { id: 'r5', title: 'Practice HR Interviews', description: 'Strengthen behavioral answers with STAR framework.', priority: 'low', impact: '+4 Interview', icon: 'Mic', color: 'text-cyan-400' },
    { id: 'r6', title: 'Complete Roadmap Week', description: 'Finish the current roadmap week to stay on track.', priority: 'low', impact: '+8 Readiness', icon: 'Map', color: 'text-rose-400' },
  ],
  deadlines: [
    { id: 'd1', company: 'Google', role: 'SWE Intern', date: 'Aug 28', daysLeft: 2, color: 'text-blue-400' },
    { id: 'd2', company: 'Amazon', role: 'SDE-1', date: 'Sep 02', daysLeft: 7, color: 'text-amber-400' },
    { id: 'd3', company: 'Adobe', role: 'Frontend Developer', date: 'Sep 05', daysLeft: 10, color: 'text-rose-400' },
    { id: 'd4', company: 'Flipkart', role: 'SDE Intern', date: 'Sep 09', daysLeft: 14, color: 'text-emerald-400' },
    { id: 'd5', company: 'JP Morgan', role: 'Technology Analyst', date: 'Sep 15', daysLeft: 20, color: 'text-violet-400' },
  ],
  achievements: [
    { id: 'ach1', title: '7 Day Streak', description: 'Consistent daily practice', icon: 'Flame', color: 'text-orange-400' },
    { id: 'ach2', title: 'Top ATS Score', description: 'Scored 90% on a resume version', icon: 'Trophy', color: 'text-amber-400' },
    { id: 'ach3', title: '100 GitHub Commits', description: 'Milestone in contributions', icon: 'GitBranch', color: 'text-slate-300' },
    { id: 'ach4', title: '50 LeetCode Problems', description: 'Reached 150 solved total', icon: 'Code2', color: 'text-blue-400' },
    { id: 'ach5', title: 'Resume Uploaded', description: 'First resume uploaded', icon: 'FileText', color: 'text-emerald-400' },
  ],
}
