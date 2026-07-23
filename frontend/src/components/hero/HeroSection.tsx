import { HeroNavbar } from './HeroNavbar'
import { HeroContent } from './HeroContent'
import { HeroFloatingCards } from './HeroFloatingCards'

export function HeroSection() {
  return (
    <div className="career-hero relative flex min-h-screen flex-col overflow-hidden bg-[#05070c] text-white">
      {/* Background layers (premium gradient + radial glow + subtle grid + noise) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070c] via-[#05070c] to-[#05070c]" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.20),rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
        {/* Noise (CSS-only, lightweight) */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(" +
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E" +
              ")",
          }}
        />
      </div>

      <HeroNavbar />
      <main className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-5 sm:px-6 lg:px-8">
        <HeroContent />
      </main>

      {/* Floating cards absolutely positioned relative to hero */}
      <HeroFloatingCards />
    </div>
  )
}


