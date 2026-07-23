import { motion } from 'framer-motion'
import { Eye, File as FileIcon } from 'lucide-react'
import type { ResumeFile } from './types'

interface ResumePreviewProps {
  resume?: ResumeFile | null
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <Eye className="h-4 w-4 text-white/40" />
        Resume Preview
      </h3>

      {resume ? (
        <>
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/14 ring-1 ring-blue-500/20">
              <FileIcon className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-white/80">{resume.name}.{resume.fileType}</p>
            <p className="mt-1 text-xs text-white/40">
              {resume.fileType.toUpperCase()} file &middot; {formatFileSize(resume.fileSize)}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <span className="text-xs text-white/40">File name</span>
              <span className="truncate pl-2 text-right text-xs text-white/70">{resume.originalName}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <span className="text-xs text-white/40">File size</span>
              <span className="text-xs text-white/70">{formatFileSize(resume.fileSize)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <span className="text-xs text-white/40">Uploaded on</span>
              <span className="text-xs text-white/70">{formatDate(resume.uploadedAt)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <span className="text-xs text-white/40">Type</span>
              <span className="text-xs text-white/70">{resume.fileType.toUpperCase()}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
              <FileIcon className="h-8 w-8 text-white/30" />
            </div>
            <p className="text-sm font-medium text-white/60">No resume uploaded yet</p>
            <p className="mt-1 text-xs text-white/30">
              Upload a PDF or DOCX to see a preview here
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {['File name', 'File size', 'Uploaded on', 'Pages'].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
              >
                <span className="text-xs text-white/40">{label}</span>
                <span className="text-xs text-white/20">—</span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}

