import { useMemo } from 'react'
import { LucideSparkles, LucideGauge, LucideActivity, LucideFileCode } from 'lucide-react'
import { HeroMetricCard } from './HeroMetricCard'

export function HeroFloatingCards() {
  // Keep animation cheap: only transforms.
  const baseCardAnimClass = useMemo(() => {
    return 'motion-safe:animate-[floaty_5.6s_ease-in-out_infinite]'
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block">
      <style>
        {`@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}
      </style>

      {/* Top-left card */}
      <div className={`pointer-events-auto absolute left-4 top-28 w-[220px] xl:left-12 xl:top-36 ${baseCardAnimClass}`}>
        <HeroMetricCard
          title="ATS Score"
          subtitle="Optimized for recruiters"
          icon={<LucideGauge size={20} />}
        />
      </div>

      {/* Top-right card */}
      <div className={`pointer-events-auto absolute right-4 top-36 w-[220px] xl:right-12 xl:top-44 motion-safe:animate-[floaty_6.4s_ease-in-out_infinite] motion-safe:[animation-delay:-0.7s]`}>
        <HeroMetricCard
          title="DSA Progress"
          subtitle="Streak + weekly goals"
          icon={<LucideActivity size={20} />}
        />
      </div>

      {/* Bottom-left card */}
      <div className={`pointer-events-auto absolute bottom-32 left-6 w-[240px] xl:bottom-40 xl:left-16 motion-safe:animate-[floaty_7.2s_ease-in-out_infinite] motion-safe:[animation-delay:-1.2s]`}>
        <HeroMetricCard
          title="Resume Score"
          subtitle="Clarity + impact analysis"
          icon={<LucideSparkles size={20} />}
        />
      </div>

      {/* Bottom-right card */}
      <div className={`pointer-events-auto absolute bottom-40 right-6 w-[240px] xl:bottom-48 xl:right-16 motion-safe:animate-[floaty_6.8s_ease-in-out_infinite] motion-safe:[animation-delay:-0.35s]`}>
        <HeroMetricCard
          title="Interview Ready"
          subtitle="Mock interviews + feedback"
          icon={<LucideFileCode size={20} />}
        />
      </div>
    </div>
  )
}


