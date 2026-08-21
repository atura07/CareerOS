import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { CareerOSLogo } from '../common/CareerOSLogo'

export function HeroNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClassName = useMemo(() => {
    return scrolled
      ? 'backdrop-blur-xl bg-white/[0.05] border border-white/10 shadow-lg'
      : 'backdrop-blur bg-white/[0.02] border border-white/0'
  }, [scrolled])

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6">
      <div
        className={`mx-auto mt-3 flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6 transition-all ${navClassName}`}
      >
        {/* Logo - left */}
        <Link to="/" className="flex items-center gap-2.5">
          <CareerOSLogo size={32} className="shrink-0 drop-shadow-md" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-white/95">CareerOS</div>
            <div className="text-[10px] sm:text-[11px] text-white/60">AI Career Operating System</div>
          </div>
        </Link>

        {/* Navigation Links - center (hidden on mobile) */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Hero navigation">
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            href="#features"
          >
            Features
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            href="#how"
          >
            How it works
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            href="#stories"
          >
            Stories
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
          <a
            className="group relative text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            href="#faq"
          >
            FAQ
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-blue-400 to-indigo-400 transition-[width,transform] duration-300 ease-out group-hover:w-full" />
          </a>
        </nav>

        {/* Actions - right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl border border-white/10 bg-white/0 px-4 py-2 text-xs sm:text-sm text-white/80 backdrop-blur transition hover:bg-white/[0.04] md:inline-flex"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(37,99,235,0.35)] transition-transform duration-200 hover:bg-blue-500 hover:-translate-y-[1px]"
          >
            Get Started
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-[#090d16]/95 p-5 backdrop-blur-2xl md:hidden shadow-2xl"
          >
            <nav className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <a
                href="#how"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              >
                How it works
              </a>
              <a
                href="#stories"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              >
                Stories
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              >
                FAQ
              </a>
              <div className="border-t border-white/10 pt-3 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-white/80"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
