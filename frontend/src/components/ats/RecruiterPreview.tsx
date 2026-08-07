import { motion } from 'framer-motion'
import { ScanSearch, AlertTriangle, FileText, AlignLeft } from 'lucide-react'
import type { RecruiterPreview as RecruiterData } from '../../data/ats'

export function RecruiterPreview({ preview }: { preview: RecruiterData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <ScanSearch className="h-4 w-4 text-white/40" />
        Recruiter ATS Preview
      </h3>

      {/* Readability score */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
        <div>
          <p className="text-xs text-white/40">Readability Score</p>
          <p className="text-2xl font-semibold text-violet-400">{preview.readabilityScore}/100</p>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <p className="flex items-center justify-center gap-1 text-sm font-medium text-white/80">
              <FileText className="h-3.5 w-3.5 text-white/40" />
              {preview.parsedSectionCount}
            </p>
            <p className="text-[10px] text-white/40">Sections</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-1 text-sm font-medium text-white/80">
              <AlignLeft className="h-3.5 w-3.5 text-white/40" />
              {preview.wordCount}
            </p>
            <p className="text-[10px] text-white/40">Words</p>
          </div>
        </div>
      </div>

      {/* Formatting issues */}
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-amber-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        Formatting issues detected
      </p>
      <ul className="space-y-1.5">
        {preview.formattingIssues.map((issue, i) => (
          <li
            key={i}
            className="flex gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-xs text-white/50"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
            {issue}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
