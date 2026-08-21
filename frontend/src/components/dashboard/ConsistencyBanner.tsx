import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Compass, Flame, ArrowRight } from 'lucide-react'
import type { ConsistencyData } from '../../services/api/dashboardService'

interface ConsistencyBannerProps {
  consistency?: ConsistencyData
}

export function ConsistencyBanner({ consistency }: ConsistencyBannerProps) {
  if (!consistency) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-purple-900/20 p-5 sm:p-6 backdrop-blur"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white/95">{consistency.message}</h3>
            <p className="mt-0.5 text-xs text-white/50 italic">{consistency.quote}</p>
          </div>
        </div>

        <Link
          to={consistency.ctaLink}
          className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/90 hover:bg-white/[0.1] hover:text-white transition-all"
        >
          <Compass className="h-4 w-4 text-blue-400" />
          {consistency.ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}
