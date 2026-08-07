import { motion } from 'framer-motion'
import { Map, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  onGenerate?: () => void
}

export function EmptyState({ onGenerate }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center backdrop-blur"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
        <Map className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">No roadmap generated yet</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-white/40">
        Configure your target company, role, and duration above, then generate a
        personalized placement preparation roadmap.
      </p>
      {onGenerate && (
        <button
          onClick={onGenerate}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <Sparkles className="h-4 w-4" />
          Generate Roadmap
        </button>
      )}
    </motion.div>
  )
}
