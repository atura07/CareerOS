import { motion } from 'framer-motion'
import { Award, Lock } from 'lucide-react'
import type { Achievement } from '../../data/dsa'

interface AchievementBadgesProps {
  achievements: Achievement[]
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const earned = achievements.filter((a) => a.earned).length

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <Award className="h-4 w-4 text-amber-400" /> Achievements
        </h3>
        <span className="text-xs text-white/40">
          {earned} / {achievements.length} earned
        </span>
      </div>

      <motion.div
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {achievements.map((badge) => (
          <motion.div
            key={badge.id}
            variants={itemVariants}
            className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center ${
              badge.earned
                ? 'border-amber-500/20 bg-amber-500/10'
                : 'border-white/[0.06] bg-white/[0.02] opacity-50'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                badge.earned
                  ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                  : 'text-white/30'
              }`}
            >
              {badge.earned ? <Award className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <p className="text-xs font-medium text-white/70">{badge.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
