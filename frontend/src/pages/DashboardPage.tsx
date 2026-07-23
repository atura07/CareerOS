import { motion } from 'framer-motion'
import { DashboardCards, QuickActions, RecentActivity } from '../components/dashboard'

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Welcome back! Here&apos;s an overview of your placement journey.
        </p>
      </motion.div>

      {/* Placeholder cards */}
      <div className="mb-8">
        <DashboardCards />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

