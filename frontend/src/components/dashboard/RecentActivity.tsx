import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'

const activities = [
  { text: 'Welcome to CareerOS! Start by uploading your resume.', time: 'Just now', active: true },
  { text: 'Complete your profile to get personalized recommendations.', time: '1m ago', active: false },
  { text: 'Explore the ATS score feature to optimize your resume.', time: '5m ago', active: false },
  { text: 'Set your target companies in the Applications section.', time: '10m ago', active: false },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function RecentActivity() {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <Clock className="h-4 w-4 text-white/40" />
        Recent Activity
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur sm:p-5"
      >
        <div className="space-y-1">
          {activities.map((activity, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex items-start gap-3 border-b border-white/[0.04] py-3 last:border-0 last:pb-0"
            >
              {activity.active && (
                <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
              )}
              {!activity.active && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-white/[0.08]" />
              )}
              <div className="flex flex-1 items-start justify-between gap-2">
                <p className="text-sm leading-relaxed text-white/60">
                  {activity.text}
                </p>
                <span className="shrink-0 text-xs text-white/30">
                  {activity.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]">
          View all activity
          <ArrowRight className="h-3 w-3" />
        </button>
      </motion.div>
    </section>
  )
}

