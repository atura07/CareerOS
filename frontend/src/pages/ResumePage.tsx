import { useState } from 'react'
import { motion } from 'framer-motion'
import { ResumeUploader, ResumeLibrary, ResumePreview } from '../components/resume'
import type { ResumeFile } from '../components/resume'

export function ResumePage() {
  const [selectedResume, setSelectedResume] = useState<ResumeFile | null>(null)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshCounter((c) => c + 1)
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          Resume Library
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Upload, manage, and organize all your resumes in one place.
        </p>
      </motion.div>

      {/* Upload section */}
      <div id="resume-upload-section" className="mb-8">
        <ResumeUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Library */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column — library */}
        <div className="space-y-6 lg:col-span-3">
          <ResumeLibrary
            refreshCounter={refreshCounter}
            onSelectResume={setSelectedResume}
          />
        </div>

        {/* Right column — preview */}
        <div className="lg:col-span-2">
          <ResumePreview resume={selectedResume} />
        </div>
      </div>
    </div>
  )
}

