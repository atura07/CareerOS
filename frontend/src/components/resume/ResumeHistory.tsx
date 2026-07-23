import { motion } from 'framer-motion'
import { FileText, Download, Clock, Trash2 } from 'lucide-react'

const history = [
  {
    name: 'Resume_v3_final.pdf',
    size: '1.2 MB',
    date: '2026-07-20',
    status: 'Analyzed',
  },
  {
    name: 'Resume_v2_updated.docx',
    size: '890 KB',
    date: '2026-07-15',
    status: 'Analyzed',
  },
  {
    name: 'Resume_initial.pdf',
    size: '1.1 MB',
    date: '2026-07-10',
    status: 'Analyzed',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function ResumeHistory() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <Clock className="h-4 w-4 text-white/40" />
        Upload History
      </h3>

      {history.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-white/40">No previous uploads</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {history.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/70">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>{item.size}</span>
                  <span>&middot;</span>
                  <span>{item.date}</span>
                  <span>&middot;</span>
                  <span className="text-emerald-400">{item.status}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:opacity-100">
                <button
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                  aria-label={`Download ${item.name}`}
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

