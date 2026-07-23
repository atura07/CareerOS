import { motion } from 'framer-motion'
import { FileText, Star, StarOff, Pencil, Trash2 } from 'lucide-react'
import type { ResumeFile } from './types'
import { RESUME_TAGS } from './resumeData'

interface ResumeListViewProps {
  resumes: ResumeFile[]
  onSelect?: (resume: ResumeFile) => void
  onRename: (resume: ResumeFile) => void
  onDelete: (resume: ResumeFile) => void
  onSetDefault: (resume: ResumeFile) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function ResumeListView({
  resumes,
  onSelect,
  onRename,
  onDelete,
  onSetDefault,
}: ResumeListViewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur overflow-hidden"
    >
      {resumes.map((resume, i) => {
        const tagMeta = resume.tags
          .map((t) => RESUME_TAGS.find((rt) => rt.id === t))
          .filter(Boolean)

        return (
          <motion.div
            key={resume.id}
            variants={itemVariants}
            onClick={() => onSelect?.(resume)}
            className={`group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.04] cursor-pointer ${
              i < resumes.length - 1 ? 'border-b border-white/[0.04]' : ''
            }`}
          >
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-white/80">{resume.name}</p>
                {resume.isDefault && (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-blue-500/14 px-2 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20">
                    <Star className="h-2.5 w-2.5 fill-blue-400" />
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40">
                {formatSize(resume.fileSize)} &middot; {resume.fileType.toUpperCase()} &middot;{' '}
                {formatDate(resume.uploadedAt)}
              </p>
            </div>

            {/* Tags */}
            <div className="hidden gap-1.5 sm:flex sm:flex-wrap">
              {tagMeta.map((t) =>
                t ? (
                  <span
                    key={t.id}
                    className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/50"
                  >
                    {t.label}
                  </span>
                ) : null,
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:opacity-100">
              <button
                onClick={() => onSetDefault(resume)}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                aria-label={resume.isDefault ? 'Remove default' : 'Set as default'}
              >
                {resume.isDefault ? (
                  <StarOff className="h-3.5 w-3.5" />
                ) : (
                  <Star className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={() => onRename(resume)}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                aria-label="Rename"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(resume)}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

