export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface TopicProgress {
  id: string
  name: string
  solved: number
  total: number
  easysolved: number
  mediumSolved: number
  hardSolved: number
  status: 'Completed' | 'In Progress' | 'Not Started'
}

export interface SheetTopic {
  name: string
  solved: number
  total: number
}

export interface Sheet {
  id: string
  name: string
  author: string
  description: string
  solved: number
  total: number
  topics: SheetTopic[]
}

export interface ActivityDay {
  date: string
  count: number
}

export interface RevisionItem {
  id: string
  topic: string
  due: string
  status: 'Due Today' | 'Upcoming' | 'Completed'
}

export interface RecentSolve {
  id: string
  title: string
  topic: string
  difficulty: Difficulty
  date: string
}

export interface Bookmark {
  id: string
  title: string
  company: string
  topic: string
  difficulty: Difficulty
  link: string
}

export interface Achievement {
  id: string
  label: string
  earned: boolean
}

export interface CalendarEvent {
  date: string
  title: string
  type: 'Study' | 'Revision' | 'Mock Interview'
}

export interface DSAStats {
  totalProblems: number
  solvedProblems: number
  dailyStreak: number
  longestStreak: number
  weeklyGoal: number
  weeklyProgress: number
}

export const DSA_STATS: DSAStats = {
  totalProblems: 270,
  solvedProblems: 161,
  dailyStreak: 12,
  longestStreak: 19,
  weeklyGoal: 15,
  weeklyProgress: 9,
}

export const TOPIC_PROGRESS: TopicProgress[] = [
  { id: 'arrays', name: 'Arrays', solved: 22, total: 28, easysolved: 10, mediumSolved: 9, hardSolved: 3, status: 'In Progress' },
  { id: 'strings', name: 'Strings', solved: 18, total: 24, easysolved: 8, mediumSolved: 8, hardSolved: 2, status: 'In Progress' },
  { id: 'linked-list', name: 'Linked List', solved: 16, total: 20, easysolved: 7, mediumSolved: 7, hardSolved: 2, status: 'In Progress' },
  { id: 'stack', name: 'Stack', solved: 12, total: 16, easysolved: 5, mediumSolved: 6, hardSolved: 1, status: 'In Progress' },
  { id: 'queue', name: 'Queue', solved: 10, total: 14, easysolved: 5, mediumSolved: 4, hardSolved: 1, status: 'In Progress' },
  { id: 'binary-tree', name: 'Binary Tree', solved: 20, total: 26, easysolved: 8, mediumSolved: 9, hardSolved: 3, status: 'In Progress' },
  { id: 'bst', name: 'BST', solved: 14, total: 18, easysolved: 6, mediumSolved: 6, hardSolved: 2, status: 'In Progress' },
  { id: 'heap', name: 'Heap', solved: 8, total: 12, easysolved: 3, mediumSolved: 4, hardSolved: 1, status: 'In Progress' },
  { id: 'graph', name: 'Graph', solved: 12, total: 30, easysolved: 3, mediumSolved: 6, hardSolved: 3, status: 'In Progress' },
  { id: 'dp', name: 'Dynamic Programming', solved: 10, total: 40, easysolved: 2, mediumSolved: 5, hardSolved: 3, status: 'In Progress' },
  { id: 'trie', name: 'Trie', solved: 4, total: 8, easysolved: 2, mediumSolved: 2, hardSolved: 0, status: 'In Progress' },
  { id: 'greedy', name: 'Greedy', solved: 9, total: 16, easysolved: 4, mediumSolved: 4, hardSolved: 1, status: 'In Progress' },
  { id: 'backtracking', name: 'Backtracking', solved: 6, total: 18, easysolved: 2, mediumSolved: 3, hardSolved: 1, status: 'In Progress' },
]

export const LOVE_BABBAR_SHEET: Sheet = {
  id: 'love-babbar',
  name: 'Love Babbar DSA Sheet',
  author: 'Love Babbar',
  description: '450 curated problems covering core DSA topics for placements.',
  solved: 96,
  total: 450,
  topics: [
    { name: 'Arrays', solved: 20, total: 36 },
    { name: 'Matrix', solved: 8, total: 10 },
    { name: 'Strings', solved: 15, total: 43 },
    { name: 'Search & Sort', solved: 12, total: 36 },
    { name: 'Linked List', solved: 14, total: 36 },
    { name: 'Binary Trees', solved: 12, total: 35 },
    { name: 'BST', solved: 8, total: 22 },
    { name: 'Greedy', solved: 7, total: 35 },
  ],
}

export const STRIVER_A2Z_SHEET: Sheet = {
  id: 'striver-a2z',
  name: 'Striver A2Z Sheet',
  author: 'Raj Vikramaditya',
  description: 'Step-by-step DSA roadmap from basics to advanced topics.',
  solved: 52,
  total: 300,
  topics: [
    { name: 'Basics', solved: 12, total: 20 },
    { name: 'Sorting', solved: 10, total: 12 },
    { name: 'Arrays', solved: 12, total: 40 },
    { name: 'Binary Search', solved: 6, total: 24 },
    { name: 'Strings', solved: 5, total: 20 },
    { name: 'Linked List', solved: 7, total: 30 },
    { name: 'Recursion', solved: 4, total: 25 },
    { name: 'Binary Tree', solved: 6, total: 40 },
  ],
}

export const DIFFICULTY_DISTRIBUTION: { difficulty: Difficulty; solved: number; total: number }[] = [
  { difficulty: 'Easy', solved: 68, total: 120 },
  { difficulty: 'Medium', solved: 58, total: 105 },
  { difficulty: 'Hard', solved: 35, total: 45 },
]

export const ACTIVITY_HEATMAP: ActivityDay[] = (() => {
  const days: ActivityDay[] = []
  const start = new Date()
  start.setDate(start.getDate() - 29)
  const pattern = [2, 0, 3, 1, 4, 0, 2, 3, 5, 1, 0, 2, 4, 3, 1, 2, 0, 3, 2, 4, 1, 0, 3, 2, 5, 1, 2, 3, 0, 2]
  for (let i = 0; i < 30; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    days.push({
      date: d.toISOString().slice(0, 10),
      count: pattern[i],
    })
  }
  return days
})()

export const REVISION_PLANNER: RevisionItem[] = [
  { id: 'rev-1', topic: 'Binary Tree Traversals', due: 'Today', status: 'Due Today' },
  { id: 'rev-2', topic: 'Graph BFS & DFS', due: 'Today', status: 'Due Today' },
  { id: 'rev-3', topic: 'Dynamic Programming Basics', due: 'Tomorrow', status: 'Upcoming' },
  { id: 'rev-4', topic: 'Linked List Reversal', due: 'In 2 days', status: 'Upcoming' },
  { id: 'rev-5', topic: 'Sliding Window', due: 'In 3 days', status: 'Upcoming' },
  { id: 'rev-6', topic: 'Two Pointers', due: 'Last week', status: 'Completed' },
  { id: 'rev-7', topic: 'Stack & Queue', due: 'Last week', status: 'Completed' },
]

export const RECENT_ACTIVITY: RecentSolve[] = [
  { id: 'act-1', title: 'Maximum Sliding Window', topic: 'Arrays', difficulty: 'Hard', date: 'Today' },
  { id: 'act-2', title: 'Serialize Binary Tree', topic: 'Binary Tree', difficulty: 'Hard', date: 'Today' },
  { id: 'act-3', title: 'Lowest Common Ancestor', topic: 'BST', difficulty: 'Medium', date: 'Yesterday' },
  { id: 'act-4', title: 'Implement Trie (Prefix Tree)', topic: 'Trie', difficulty: 'Medium', date: 'Yesterday' },
  { id: 'act-5', title: 'House Robber II', topic: 'Dynamic Programming', difficulty: 'Medium', date: '2 days ago' },
  { id: 'act-6', title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', date: '2 days ago' },
]

export const BOOKMARKS: Bookmark[] = [
  { id: 'bm-1', title: 'Median of Two Sorted Arrays', company: 'Google', topic: 'Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  { id: 'bm-2', title: 'Trapping Rain Water', company: 'Amazon', topic: 'Stack', difficulty: 'Hard', link: 'https://leetcode.com/problems/trapping-rain-water/' },
  { id: 'bm-3', title: 'Word Ladder', company: 'Meta', topic: 'Graph', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-ladder/' },
  { id: 'bm-4', title: 'Edit Distance', company: 'Microsoft', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/edit-distance/' },
  { id: 'bm-5', title: 'Sliding Window Maximum', company: 'Amazon', topic: 'Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
  { id: 'bm-6', title: 'Critical Connections', company: 'Google', topic: 'Graph', difficulty: 'Hard', link: 'https://leetcode.com/problems/critical-connections-in-a-network/' },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', label: 'First Solve', earned: true },
  { id: 'ach-2', label: '50 Solved', earned: true },
  { id: 'ach-3', label: '100 Solved', earned: true },
  { id: 'ach-4', label: '7-Day Streak', earned: true },
  { id: 'ach-5', label: '14-Day Streak', earned: true },
  { id: 'ach-6', label: '30 Hard Problems', earned: false },
  { id: 'ach-7', label: '200 Solved', earned: false },
  { id: 'ach-8', label: '30-Day Streak', earned: false },
]

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: '2025-08-18', title: 'Study: Arrays & Strings', type: 'Study' },
  { date: '2025-08-19', title: 'Revise Binary Trees', type: 'Revision' },
  { date: '2025-08-20', title: 'Mock Interview — DSA', type: 'Mock Interview' },
  { date: '2025-08-21', title: 'Study: Dynamic Programming', type: 'Study' },
  { date: '2025-08-22', title: 'Revise Graphs', type: 'Revision' },
  { date: '2025-08-23', title: 'Mock Interview — System Design', type: 'Mock Interview' },
  { date: '2025-08-24', title: 'Study: Greedy & Backtracking', type: 'Study' },
]

export const WEEKLY_GOALS = [
  { id: 'wg-1', label: 'Solve 10 Medium problems', done: true },
  { id: 'wg-2', label: 'Complete Graph revision', done: true },
  { id: 'wg-3', label: 'Solve 3 Hard problems', done: false },
  { id: 'wg-4', label: 'Attend 1 mock interview', done: false },
  { id: 'wg-5', label: 'Revise DP patterns', done: false },
]
