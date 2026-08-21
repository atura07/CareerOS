import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CareerOSLogo } from '../common/CareerOSLogo'


export function HeroNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClassName = useMemo(() => {
    // stronger glass on scroll, minimal cost: only className changes
    return scrolled
      ? 'backdrop-blur-xl bg-white/[0.05] border border-white/10'
      : 'backdrop-blur bg-white/[0.02] border border-white/0'
  }, [scrolled])

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`mx-auto mt-3 flex w-full max-w-7xl items-center justify-between rounded-2xl px-5 py-3 sm:px-6 ${navClassName}`}
      >
        {/* Logo - left */}
        <div className="flex items-center gap-3">
          <CareerOSLogo size={36} className="shrink-0 drop-shadow-md" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-white/95">CareerOS</div>
            <div className="text-[11px] text-white/60">AI Career Operating System</div>
          </div>
        </div>

        {/* Navigation Links - center (hidden on mobile) */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Hero navigation">
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
            href="#features"
          >
            Features
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
            href="#how"
          >
            How it works
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
            href="#stories"
          >
            Stories
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
            href="#faq"
          >
            FAQ
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
        </nav>

        {/* Actions - right */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl border border-white/10 bg-white/0 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/[0.04] hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c] md:inline-flex"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(37,99,235,0.35)] transition-transform duration-200 hover:bg-blue-500 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}


