import { motion } from 'framer-motion'

/* ─── Monochrome company SVG logos (inline for zero external deps) ─── */

const companyLogos: {
  name: string
  svg: (hover: boolean) => React.ReactNode
}[] = [
  {
    name: 'Google',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill={h ? '#4285F4' : 'currentColor'}
          className="transition-colors duration-300"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill={h ? '#34A853' : 'currentColor'}
          className="transition-colors duration-300"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill={h ? '#FBBC05' : 'currentColor'}
          className="transition-colors duration-300"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill={h ? '#EA4335' : 'currentColor'}
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <rect x="3" y="3" width="8" height="8" rx="1" fill={h ? '#F25022' : 'currentColor'} className="transition-colors duration-300" />
        <rect x="13" y="3" width="8" height="8" rx="1" fill={h ? '#7FBA00' : 'currentColor'} className="transition-colors duration-300" />
        <rect x="3" y="13" width="8" height="8" rx="1" fill={h ? '#00A4EF' : 'currentColor'} className="transition-colors duration-300" />
        <rect x="13" y="13" width="8" height="8" rx="1" fill={h ? '#FFB900' : 'currentColor'} className="transition-colors duration-300" />
      </svg>
    ),
  },
  {
    name: 'Amazon',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <path
          d="M13.78 4.31c-.81-.48-1.87-.72-3.19-.72-1.49 0-2.72.33-3.69 1-.97.66-1.44 1.47-1.44 2.43 0 .68.23 1.25.69 1.71.46.46 1.07.71 1.82.76v-.08c-.57-.1-1.01-.34-1.33-.72s-.49-.76-.49-1.24c0-.73.35-1.35 1.05-1.87s1.65-.79 2.86-.79c1.07 0 1.97.17 2.7.52l.02.02v.03c-.12.13-.22.28-.3.47-.08.19-.12.38-.12.58 0 .32.11.59.32.81.21.22.5.33.86.33.27 0 .52-.06.76-.18s.42-.29.59-.51c.16-.22.24-.47.24-.75 0-.8-.39-1.43-1.17-1.89l.01-.01-.02.01zm-.86 2.94c-.11.49-.3.86-.57 1.11s-.62.37-1.01.37c-.28 0-.51-.09-.69-.27a.94.94 0 01-.26-.69c0-.39.14-.73.41-1.02.27-.29.64-.51 1.11-.66.18-.05.34-.08.48-.08.23 0 .42.06.56.18.15.12.22.29.22.51 0 .24-.08.47-.25.69v-.07-.07l.01.02-.01.01h.01l-.02.01h.01l-.02.01.01.01-.01.01-.01.01.01-.01h-.01l.01-.01-.02.01-.01-.01.02-.01.01-.01-.01.01.02-.01.01.01-.01-.01h.01l-.01-.01h.01-.01v.01l.01-.01.01-.01-.01.01-.01-.01.01-.01h.01-.01V7.25z"
          fill="currentColor"
        />
        <path
          d="M11.99 18.94c-2.77 2.07-6.79 3.17-10.25 2.05 1.49 1.69 3.57 2.71 5.82 2.71 2.63 0 5.01-1.05 6.72-2.84-.76.1-1.54.14-2.29.08z"
          fill={h ? '#FF9900' : 'currentColor'}
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
  {
    name: 'Meta',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <path
          d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z"
          fill={h ? '#1877F2' : 'currentColor'}
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
  {
    name: 'Apple',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <path
          d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'Netflix',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <path
          d="M5.5 2h3.5l4.5 9.5V2h3.5v20h-3.5L9 12.5V22H5.5V2z"
          fill={h ? '#E50914' : 'currentColor'}
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
  {
    name: 'Adobe',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <path
          d="M14.5 2L22 20h-3.5L14.5 2zM9.5 2L2 20h3.5L9.5 2zM12 8.5L15.5 18h-3l-1-2.5h-2L12 8.5z"
          fill={h ? '#FF0000' : 'currentColor'}
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
  {
    name: 'Uber',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill={h ? '#09091a' : 'transparent'} className="transition-colors duration-300" />
        <path
          d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"
          fill={h ? '#09091a' : 'currentColor'}
          className="transition-colors duration-300"
        />
        <path
          d="M12 9c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"
          fill={h ? '#06C167' : 'currentColor'}
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
  {
    name: 'Flipkart',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" fill={h ? '#2874F0' : 'transparent'} className="transition-colors duration-300" />
        <path
          d="M8 8l4 4-4 4M16 8l-4 4 4 4"
          stroke={h ? '#FFC200' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
  {
    name: 'Walmart Global Tech',
    svg: (h) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-auto">
        <path
          d="M12 2L14.09 8.26L20.49 5.34L18.22 11.79L24 14.5L18.22 17.21L20.49 23.66L14.09 20.74L12 27L9.91 20.74L3.51 23.66L5.78 17.21L0 14.5L5.78 11.79L3.51 5.34L9.91 8.26L12 2z"
          fill={h ? '#0071CE' : 'currentColor'}
          className="transition-colors duration-300"
        />
      </svg>
    ),
  },
]

/* ─── Staggered fade-up animation variants ─── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

/* ─── Trusted Companies Section ─── */

export function TrustedCompanies() {
  return (
    <section
      className="relative overflow-hidden bg-[#05070c] px-5 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8"
      aria-labelledby="trusted-heading"
    >
      {/* Subtle background glow (same design language as Hero) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),rgba(99,102,241,0.04),transparent)]" />
      </div>

      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium tracking-widest text-white/40 uppercase">
          Trusted By
        </p>
        <h2
          id="trusted-heading"
          className="mt-3 text-balance text-2xl font-semibold leading-snug tracking-tight text-white/90 sm:text-3xl"
        >
          Trusted by students preparing for the world&apos;s best companies
        </h2>
      </motion.div>

      {/* Company logos grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
      >
        {companyLogos.map((company) => (
          <motion.div
            key={company.name}
            variants={itemVariants}
            className="group"
          >
            <CompanyCard name={company.name}>
              {company.svg(false)}
            </CompanyCard>
            {/* Hover-aware version is handled via CSS group-hover in CompanyCard */}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ─── Glass card with hover color transition ─── */

function CompanyCard({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <div
      className="flex cursor-default flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-6 backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none"
      role="listitem"
      aria-label={`${name} logo`}
    >
      {/* Logo container with group-based hover color toggling */}
      <div className="flex items-center justify-center text-white/40 transition-colors duration-300 group-hover:text-white/90">
        {children}
      </div>
      <span className="text-[11px] font-medium tracking-wide text-white/30 transition-colors duration-300 group-hover:text-white/60">
        {name}
      </span>
    </div>
  )
}

