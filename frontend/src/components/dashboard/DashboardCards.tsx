import { motion } from 'framer-motion'
import { FileText, BarChart3, Briefcase, Mic } from 'lucide-react'

const cards = [
  {
    title: 'Resume Score',
    icon: FileText,
    description: 'Upload your resume to get an AI-powered score',
    color: 'text-blue-400',
    bgGlow: 'bg-blue-500/10',
    borderGlow: 'ring-blue-500/20',
  },
  {
    title: 'ATS Score',
    icon: BarChart3,
    description: 'Check how ATS-friendly your resume is',
    color: 'text-amber-400',
    bgGlow: 'bg-amber-500/10',
    borderGlow: 'ring-amber-500/20',
  },
  {
    title: 'Applications',
    icon: Briefcase,
    description: 'Track your job applications and statuses',
    color: 'text-emerald-400',
    bgGlow: 'bg-emerald-500/10',
    borderGlow: 'ring-emerald-500/20',
  },
  {
    title: 'Mock Interviews',
    icon: Mic,
    description: 'Practice with AI-powered mock interviews',
    color: 'text-purple-400',
    bgGlow: 'bg-purple-500/10',
    borderGlow: 'ring-purple-500/20',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function DashboardCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div key={card.title} variants={itemVariants}>
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] motion-reduce:transition-none">
              {/* Hover glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:opacity-0"
                style={{
                  background: `radial-gradient(200px at 50% 0%, ${card.color === 'text-blue-400' ? 'rgba(59,130,246,0.08)' : card.color === 'text-amber-400' ? 'rgba(251,191,36,0.08)' : card.color === 'text-emerald-400' ? 'rgba(52,211,153,0.08)' : 'rgba(168,85,247,0.08)'}, transparent)`,
                }}
              />

              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgGlow} ring-1 ${card.borderGlow} transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100`}
              >
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>

              <h3 className="text-base font-semibold tracking-tight text-white/90">
                {card.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                {card.description}
              </p>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full w-0 rounded-full transition-all duration-700 group-hover:w-[55%] motion-reduce:w-[55%]"
                  style={{
                    background:
                      card.color === 'text-blue-400'
                        ? 'linear-gradient(90deg, rgba(59,130,246,0.4), rgba(59,130,246,0.2))'
                        : card.color === 'text-amber-400'
                          ? 'linear-gradient(90deg, rgba(251,191,36,0.4), rgba(251,191,36,0.2))'
                          : card.color === 'text-emerald-400'
                            ? 'linear-gradient(90deg, rgba(52,211,153,0.4), rgba(52,211,153,0.2))'
                            : 'linear-gradient(90deg, rgba(168,85,247,0.4), rgba(168,85,247,0.2))',
                  }}
                />
              </div>
              <p className="mt-1 text-right text-xs text-white/30">Placeholder</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

