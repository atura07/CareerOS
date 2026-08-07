import { motion } from 'framer-motion'
import { Eye, Mail, Phone, MapPin, Link2 } from 'lucide-react'
import type { ParsedResume } from '../../data/ats'

const CONTACT_ICONS = [Mail, Phone, MapPin, Link2] as const

function SectionBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-4">
      <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-400">
        {title}
      </h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/50">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/20" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ResumePreview({ resume }: { resume: ParsedResume }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <Eye className="h-4 w-4 text-white/40" />
        Parsed Resume Preview
      </h3>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        {/* Header */}
        <div className="mb-4 border-b border-white/[0.06] pb-4">
          <h4 className="text-lg font-semibold text-white/90">{resume.name}</h4>
          <p className="text-xs text-blue-400">{resume.title}</p>
          <div className="mt-2 space-y-1">
            {resume.contact.map((item, i) => {
              const Icon = CONTACT_ICONS[i] ?? Mail
              return (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-white/40">
                  <Icon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              )
            })}
          </div>
        </div>

        <p className="mb-4 text-xs leading-relaxed text-white/60">{resume.summary}</p>

        <SectionBlock title="Skills" items={resume.skills} />
        <SectionBlock title="Experience" items={resume.experience} />
        <SectionBlock title="Projects" items={resume.projects} />
        <SectionBlock title="Education" items={resume.education} />
        <SectionBlock title="Certifications" items={resume.certifications} />
      </div>
    </motion.div>
  )
}
