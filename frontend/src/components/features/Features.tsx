import { motion } from 'framer-motion'
import {
  FileText,
  BarChart3,
  Code2,
  Mic,
  Map,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

/* ─── Feature data ─── */

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: FileText,
    title: 'AI Resume Analyzer',
    description:
      'Analyze resumes with AI and receive actionable improvements.',
  },
  {
    icon: BarChart3,
    title: 'ATS Score',
    description:
      'Predict ATS compatibility before applying.',
  },
  {
    icon: Code2,
    title: 'DSA Tracker',
    description:
      'Track coding progress and company-specific preparation.',
  },
  {
    icon: Mic,
    title: 'AI Mock Interview',
    description:
      'Practice interviews with AI-generated questions.',
  },
  {
    icon: Map,
    title: 'Learning Roadmap',
    description:
      'Personalized learning paths based on your goals.',
  },
  {
    icon: LayoutDashboard,
    title: 'Placement Dashboard',
    description:
      'Manage applications, interviews, and offers in one place.',
  },
]

/* ─── Stagger animation variants ─── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

/* ─── Features Section ─── */

export function Features() {
  return (
    <section
      className="relative overflow-hidden bg-[#05070c] px-5 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8"
      aria-labelledby="features-heading"
    >
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.12),rgba(99,102,241,0.05),transparent)]" />
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium tracking-widest text-white/40 uppercase">
          Everything You Need
        </p>
        <h2
          id="features-heading"
          className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white/90 sm:text-4xl md:text-5xl"
        >
          Powerful tools to crack your dream placement
        </h2>
        <p className="mt-4 text-balance text-base leading-relaxed text-white/60 sm:text-lg">
          From resume analysis to mock interviews — an all-in-one AI-powered
          platform built for placement success.
        </p>
      </motion.div>

      {/* Feature cards grid — 3 × 2 on large screens */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <FeatureCard feature={feature} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ─── Feature Card ─── */

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon

  return (
    <div
      className="group relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur transition-all duration-300 motion-safe:hover:-translate-y-[2px] motion-safe:hover:scale-[1.02] hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c] motion-reduce:transition-none"
      tabIndex={0}
      role="article"
    >
      {/* Glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:opacity-0"
        style={{
          background:
            'radial-gradient(280px at 50% 0%, rgba(59,130,246,0.08), transparent)',
        }}
      />

      {/* Icon container */}
      <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/14 ring-1 ring-blue-500/20 transition-colors duration-300 group-hover:bg-blue-500/20">
        <Icon className="h-6 w-6 text-blue-400 transition-transform duration-300 motion-safe:group-hover:scale-110" />
      </div>

      {/* Text */}
      <h3 className="relative text-lg font-semibold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-white">
        {feature.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
        {feature.description}
      </p>
    </div>
  )
}

