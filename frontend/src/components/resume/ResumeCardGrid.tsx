import { motion } from 'framer-motion'
import { FileText, Star, Trash2, Pencil, StarOff } from 'lucide-react'
import type { ResumeFile } from './types'
import { RESUME_TAGS } from './resumeData'

interface ResumeCardGridProps {
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
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function ResumeCardGrid({
  resumes,
  onSelect,
  onRename,
  onDelete,
  onSetDefault,
}: ResumeCardGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {resumes.map((resume) => {
        const tagMeta = resume.tags
          .map((t) => RESUME_TAGS.find((rt) => rt.id === t))
          .filter(Boolean)

        return (
          <motion.div
            key={resume.id}
            variants={itemVariants}
            onClick={() => onSelect?.(resume)}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] motion-reduce:transition-none cursor-pointer"
          >
            {/* Default badge */}
            {resume.isDefault && (
              <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-500/14 px-2 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20">
                <Star className="h-3 w-3 fill-blue-400" />
                Default
              </div>
            )}

            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/14 ring-1 ring-blue-500/20 transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>

            {/* Name */}
            <h3 className="text-base font-semibold tracking-tight text-white/90 truncate pr-16">
              {resume.name}
            </h3>

            {/* Meta */}
            <p className="mt-1 text-xs text-white/40">
              {formatSize(resume.fileSize)} &middot; {resume.fileType.toUpperCase()} &middot;{' '}
              {formatDate(resume.uploadedAt)}
            </p>
            <p className="text-[11px] text-white/30 truncate">{resume.originalName}</p>

            {/* Tags */}
            {tagMeta.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tagMeta.map((t) =>
                  t ? (
                    <span
                      key={t.id}
                      className={`inline-flex items-center rounded-full border border-${t.color}-500/20 bg-${t.color}-500/10 px-2 py-0.5 text-[10px] font-medium text-${t.color}-400`}
                    >
                      {t.label}
                    </span>
                  ) : null,
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center justify-end gap-1 border-t border-white/[0.04] pt-3 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:opacity-100">
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

