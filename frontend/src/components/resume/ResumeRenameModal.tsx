import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pencil } from 'lucide-react'

interface ResumeRenameModalProps {
  open: boolean
  currentName: string
  onClose: () => void
  onSave: (newName: string) => void
}

export function ResumeRenameModal({
  open,
  currentName,
  onClose,
  onSave,
}: ResumeRenameModalProps) {
  const [name, setName] = useState(currentName)

  useEffect(() => {
    if (open) setName(currentName)
  }, [open, currentName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed && trimmed !== currentName) {
      onSave(trimmed)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/[0.08] bg-[#0a0d14] p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
                    <Pencil className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/90">Rename Resume</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label htmlFor="rename-input" className="mb-1.5 block text-xs font-medium text-white/50">
                Resume name
              </label>
              <input
                id="rename-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white/80 placeholder-white/30 transition-colors focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || name.trim() === currentName}
                  className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

