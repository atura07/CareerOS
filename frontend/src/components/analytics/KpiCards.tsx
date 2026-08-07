import { motion } from 'framer-motion'
import { Send, Activity, Award, Mic, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { AnalyticsData, Kpi } from '../../data/analytics'

const ICONS: Record<string, typeof Send> = {
  Send,
  Activity,
  Award,
  Mic,
}

const TREND_ICONS: Record<Kpi['trend'], typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
}

const TREND_COLOR: Record<Kpi['trend'], string> = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  neutral: 'text-white/40',
}

export function KpiCards({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {data.kpis.map((kpi, i) => {
        const Icon = ICONS[kpi.icon] ?? Activity
        const TrendIcon = TREND_ICONS[kpi.trend]
        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <TrendIcon className={`h-4 w-4 ${TREND_COLOR[kpi.trend]}`} />
            </div>
            <p className="text-2xl font-semibold tracking-tight text-white/90">{kpi.value}</p>
            <p className="text-xs text-white/40">{kpi.label}</p>
            <p className="mt-1 text-[11px] text-white/30">{kpi.delta}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
