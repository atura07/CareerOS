import { motion } from 'framer-motion'
import { Trophy, Globe, Users } from 'lucide-react'
import type { LeetCodeProfile } from '../../data/leetcode'

export function ProfileCard({ profile }: { profile: LeetCodeProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 text-2xl font-bold text-amber-400 ring-1 ring-amber-500/20">
          {profile.avatar}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-white/90">
            {profile.username}
          </h2>
          <p className="mt-0.5 text-xs text-white/40">LeetCode Profile</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-center">
          <Trophy className="mx-auto mb-1 h-4 w-4 text-amber-400" />
          <p className="text-sm font-semibold text-white/80">
            {profile.contestRating.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-white/40">Rating</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-center">
          <Globe className="mx-auto mb-1 h-4 w-4 text-blue-400" />
          <p className="text-sm font-semibold text-white/80">
            #{profile.globalRank.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-white/40">Global</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-center">
          <Users className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
          <p className="text-sm font-semibold text-white/80">
            #{profile.countryRank.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-white/40">Country</p>
        </div>
      </div>
    </motion.div>
  )
}
