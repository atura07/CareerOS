import { motion } from 'framer-motion'
import { FileText, Plus } from 'lucide-react'

interface ResumeEmptyStateProps {
  onUpload: () => void
}

export function ResumeEmptyState({ onUpload }: ResumeEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-16 backdrop-blur"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
        <FileText className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white/70">No resumes yet</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-white/40">
        Upload your first resume to get started with AI-powered analysis and tracking.
      </p>
      <button
        onClick={onUpload}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <Plus className="h-4 w-4" />
        Upload Resume
      </button>
    </motion.div>
  )
}

