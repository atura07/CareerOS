import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, FileText, RotateCcw, AlertCircle } from 'lucide-react'
import { UploadZone } from './UploadZone'
import { uploadResume } from '../../services/api'

interface ResumeUploaderProps {
  onUploadSuccess?: () => void
}

export function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelected = async (f: File) => {
    setFile(f)
    setIsUploading(true)
    setUploaded(false)
    setUploadError(null)

    try {
      await uploadResume(f)
      setIsUploading(false)
      setUploaded(true)
      onUploadSuccess?.()
    } catch (err: any) {
      setIsUploading(false)
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.file?.[0] ||
        'Upload failed. Please try again.'
      setUploadError(message)
    }
  }

  const handleReset = () => {
    setFile(null)
    setIsUploading(false)
    setUploaded(false)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div>
      {!file && <UploadZone onFileSelected={handleFileSelected} isUploading={false} />}

      <AnimatePresence mode="wait">
        {file && (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-white/70">
                {uploaded ? 'Resume Uploaded' : 'Uploading...'}
              </h3>
              <button
                onClick={handleReset}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                aria-label="Upload a different file"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* File card */}
            <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  uploaded
                    ? 'bg-emerald-500/14 text-emerald-400 ring-1 ring-emerald-500/20'
                    : 'bg-blue-500/14 text-blue-400 ring-1 ring-blue-500/20'
                }`}
              >
                {uploaded ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <FileText className="h-6 w-6" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/80">
                  {file.name}
                </p>
                <p className="text-xs text-white/40">{formatSize(file.size)}</p>
              </div>

              {!uploaded && (
                <div className="shrink-0">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/[0.08] border-t-blue-400" />
                </div>
              )}
            </div>

            {/* Progress bar (during upload) */}
            {isUploading && (
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-white/50">
                  <span>Uploading...</span>
                  <span>{Math.min(Math.floor((Date.now() % 2500) / 2500 * 100), 99)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 2.2, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/8 p-3 text-xs text-red-400">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              </motion.div>
            )}

            {/* Success state */}
            {uploaded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-3 text-xs text-emerald-400">
                  Resume uploaded successfully — AI analysis will be available soon.
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

