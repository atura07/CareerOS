import { motion } from 'framer-motion'
import { MapPin, Building2, Globe, Users, UserPlus } from 'lucide-react'
import type { GitHubProfile } from '../../data/github'

export function ProfileCard({ profile }: { profile: GitHubProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur sm:flex-row sm:items-start"
    >
      {/* Avatar */}
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-3xl font-bold text-blue-400 ring-1 ring-blue-500/20">
        {profile.avatar}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <h2 className="text-xl font-semibold tracking-tight text-white/90">
          {profile.fullName}
        </h2>
        <p className="text-sm font-medium text-blue-400">@{profile.username}</p>
        <p className="mt-2 text-sm text-white/50">{profile.bio}</p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/40 sm:justify-start">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {profile.location}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" /> {profile.company}
          </span>
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> {profile.website}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/60 sm:justify-start">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {profile.followers} followers
          </span>
          <span className="flex items-center gap-1">
            <UserPlus className="h-3 w-3" /> {profile.following} following
          </span>
          <span>{profile.publicRepos} public repos</span>
          <span>Joined {profile.joinedDate}</span>
        </div>
      </div>
    </motion.div>
  )
}
