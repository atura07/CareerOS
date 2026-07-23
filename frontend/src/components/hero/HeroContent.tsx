import { Link } from 'react-router-dom'

export function HeroContent() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center pb-16 pt-14 sm:pt-20 lg:pb-24">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        Premium career OS for placements
      </div>

      {/* Heading — max-width 900px, centered */}
      <h1 className="mx-auto mt-6 max-w-[900px] text-center text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
        Your AI Career Operating System
      </h1>

      {/* Description — max-width 700px, centered */}
      <p className="mx-auto mt-5 max-w-[700px] text-center text-base leading-relaxed text-white/70 sm:text-lg">
        Everything you need to crack placements — Resume, ATS, DSA, GitHub, Companies, Mock Interviews and AI Career Mentor —
        <span className="hidden sm:inline"> all in one platform.</span>
      </p>

      {/* CTA Buttons — inline, centered, never full width */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/register"
          className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(37,99,235,0.35)] transition duration-200 hover:-translate-y-[1px] hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
        >
          Get Started
        </Link>
        <button className="inline-flex items-center rounded-xl border border-white/10 bg-white/0 px-6 py-3 text-sm font-semibold text-white/85 backdrop-blur transition duration-200 hover:bg-white/[0.04] hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]">
          Watch Demo
        </button>
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">ATS Score</div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">DSA Tracker</div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">GitHub Analytics</div>
      </div>
    </div>
  )
}


