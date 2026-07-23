import { motion } from 'framer-motion'
import { Upload, BarChart3, Play, Target } from 'lucide-react'

const actions = [
  { label: 'Upload Resume', icon: Upload, description: 'AI analysis & scoring' },
  { label: 'Check ATS', icon: BarChart3, description: 'Optimize your resume' },
  { label: 'Practice Interview', icon: Play, description: 'AI mock session' },
  { label: 'Set Goals', icon: Target, description: 'Track your progress' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function QuickActions() {
  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/70">
        Quick Actions
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              variants={itemVariants}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 motion-reduce:transition-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20 transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100">
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/80">{action.label}</p>
                <p className="text-[11px] text-white/40">{action.description}</p>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}

