import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import type { Application, ApplicationStatus, Priority } from '../../data/applications'

const STATUSES: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'OA Scheduled',
  'OA Cleared',
  'Technical Interview',
  'HR Interview',
  'Offer',
  'Rejected',
]

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low']

interface AddApplicationModalProps {
  open: boolean
  onClose: () => void
  onAdd: (application: Application) => void
}

export function AddApplicationModal({ open, onClose, onAdd }: AddApplicationModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [packageValue, setPackageValue] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('Wishlist')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [deadline, setDeadline] = useState('')
  const [applicationLink, setApplicationLink] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const company = companyName.trim()
    if (!company) return
    const app: Application = {
      id: `app-${Date.now()}`,
      companyName: company,
      companyLogo: company.charAt(0).toUpperCase(),
      role: role.trim() || 'Software Engineer',
      package: packageValue.trim() || '—',
      location: location.trim() || '—',
      appliedDate: new Date().toISOString().slice(0, 10),
      lastUpdated: new Date().toISOString().slice(0, 10),
      status,
      nextRound: status === 'Offer' || status === 'Rejected' ? '—' : 'Next Round',
      notes: '',
      recruiter: '',
      recruiterEmail: '',
      applicationLink: applicationLink.trim(),
      deadline: deadline || new Date().toISOString().slice(0, 10),
      priority,
    }
    onAdd(app)
    setCompanyName('')
    setRole('')
    setPackageValue('')
    setLocation('')
    setStatus('Wishlist')
    setPriority('Medium')
    setDeadline('')
    setApplicationLink('')
    onClose()
  }

  const fieldClass =
    'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white/80 placeholder-white/30 transition-colors focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20'

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
            className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/[0.08] bg-[#0a0d14] p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
                    <Plus className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/90">Add Application</h3>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Company name *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google"
                    className={fieldClass}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE 1"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Package</label>
                  <input
                    type="text"
                    value={packageValue}
                    onChange={(e) => setPackageValue(e.target.value)}
                    placeholder="e.g. ₹20 LPA"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className={`${fieldClass} bg-[#0a0d14]`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-[#0a0d14]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className={`${fieldClass} bg-[#0a0d14]`}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p} className="bg-[#0a0d14]">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`${fieldClass} [color-scheme:dark]`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Application link</label>
                  <input
                    type="url"
                    value={applicationLink}
                    onChange={(e) => setApplicationLink(e.target.value)}
                    placeholder="https://..."
                    className={fieldClass}
                  />
                </div>
              </div>

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
                  disabled={!companyName.trim()}
                  className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  Add Application
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
