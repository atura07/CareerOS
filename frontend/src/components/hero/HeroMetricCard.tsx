import type { ReactNode } from 'react'

export function HeroMetricCard({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle: string
  icon: ReactNode
}) {
  return (
    <div
      className="rounded-[24px] bg-[#0b1220]/55 p-4 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition-transform duration-300 will-change-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold tracking-tight">{title}</div>
          <div className="mt-1 text-xs leading-relaxed text-white/60">{subtitle}</div>
        </div>
        <div className="mt-0.5 rounded-xl bg-blue-500/14 p-2 text-blue-200 ring-1 ring-blue-500/20">
          {icon}
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-[55%] rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
      </div>
    </div>
  )
}


