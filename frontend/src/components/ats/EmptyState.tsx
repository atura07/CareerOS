import { motion } from 'framer-motion'
import { FileSearch, UploadCloud } from 'lucide-react'

interface EmptyStateProps {
  onUpload: () => void
}

export function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-20 text-center backdrop-blur"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/14 ring-1 ring-blue-500/20">
        <FileSearch className="h-10 w-10 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-white/80">No resume analyzed yet</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/40">
        Upload your resume to receive a comprehensive ATS score, keyword analysis, and
        actionable improvement suggestions tailored to your target roles.
      </p>
      <button
        onClick={onUpload}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <UploadCloud className="h-4 w-4" />
        Upload Resume
      </button>
    </motion.div>
  )
}
