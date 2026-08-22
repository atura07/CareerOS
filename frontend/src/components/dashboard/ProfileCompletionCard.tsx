import { motion } from 'framer-motion'
import { CheckCircle2, CircleDashed, UserCheck } from 'lucide-react'
import type { ProfileCompletionData } from '../../services/api/dashboardService'

interface ProfileCompletionCardProps {
  profile?: ProfileCompletionData
}

export function ProfileCompletionCard({ profile }: ProfileCompletionCardProps) {
  if (!profile) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 backdrop-blur"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-bold tracking-tight text-white/90">Profile Completion</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/40 font-medium">
            {profile.completedFieldsCount} of {profile.totalFieldsCount} completed
          </span>
          <span className="text-xs font-bold text-blue-400">{profile.percentage}%</span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06] mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${profile.percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {profile.fields.map((f) => (
          <div
            key={f.name}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs border ${
              f.completed
                ? 'border-emerald-500/20 bg-emerald-500/05 text-emerald-300'
                : 'border-white/[0.04] bg-white/[0.02] text-white/50'
            }`}
          >
            <span>{f.name}</span>
            {f.completed ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            ) : (
              <CircleDashed className="h-3.5 w-3.5 text-white/30 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
