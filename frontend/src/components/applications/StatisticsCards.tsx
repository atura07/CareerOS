import { motion } from 'framer-motion'
import {
  Briefcase,
  Activity,
  Award,
  XCircle,
  CalendarClock,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface Stats {
  total: number
  active: number
  offers: number
  rejected: number
  upcomingInterviews: number
}

interface StatItem {
  key: keyof Stats
  label: string
  value: number
  icon: ReactNode
  color: string
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function StatisticsCards({ stats }: { stats: Stats }) {
  const items: StatItem[] = [
    { key: 'total', label: 'Total Applications', value: stats.total, icon: <Briefcase className="h-4 w-4" />, color: 'text-blue-400' },
    { key: 'active', label: 'Active', value: stats.active, icon: <Activity className="h-4 w-4" />, color: 'text-violet-400' },
    { key: 'offers', label: 'Offers', value: stats.offers, icon: <Award className="h-4 w-4" />, color: 'text-emerald-400' },
    { key: 'rejected', label: 'Rejected', value: stats.rejected, icon: <XCircle className="h-4 w-4" />, color: 'text-rose-400' },
    { key: 'upcomingInterviews', label: 'Upcoming Interviews', value: stats.upcomingInterviews, icon: <CalendarClock className="h-4 w-4" />, color: 'text-amber-400' },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {items.map((item) => (
        <motion.div
          key={item.key}
          variants={itemVariants}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-colors duration-300 hover:border-white/[0.12]"
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]">
            <span className={item.color}>{item.icon}</span>
          </div>
          <p className="text-xl font-semibold tracking-tight text-white/90">{item.value}</p>
          <p className="mt-0.5 text-xs text-white/40">{item.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
