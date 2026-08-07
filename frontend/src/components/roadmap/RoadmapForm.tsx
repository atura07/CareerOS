import { motion } from 'framer-motion'
import { Sparkles, Building2, Briefcase, Clock, Code2 } from 'lucide-react'
import type { TargetCompany, TargetRole, Duration, SkillName } from '../../data/roadmap'
import {
  TARGET_COMPANIES,
  TARGET_ROLES,
  DURATIONS,
  CURRENT_SKILLS,
} from '../../data/roadmap'

interface RoadmapFormProps {
  company: TargetCompany
  role: TargetRole
  duration: Duration
  selectedSkills: SkillName[]
  onCompanyChange: (company: TargetCompany) => void
  onRoleChange: (role: TargetRole) => void
  onDurationChange: (duration: Duration) => void
  onToggleSkill: (skill: SkillName) => void
  onGenerate: () => void
}

export function RoadmapForm({
  company,
  role,
  duration,
  selectedSkills,
  onCompanyChange,
  onRoleChange,
  onDurationChange,
  onToggleSkill,
  onGenerate,
}: RoadmapFormProps) {
  const selectClass =
    'w-full appearance-none rounded-xl border border-white/[0.06] bg-[#0a0d14] px-3 py-2.5 pl-10 text-sm text-white/80 backdrop-blur transition-colors hover:border-white/[0.12] focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/14 ring-1 ring-blue-500/20">
          <Sparkles className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Roadmap Generator</h3>
          <p className="text-xs text-white/40">Configure your placement preparation plan</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Target Company */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">Target Company</label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <select
              value={company}
              onChange={(e) => onCompanyChange(e.target.value as TargetCompany)}
              className={selectClass}
            >
              {TARGET_COMPANIES.map((c) => (
                <option key={c} value={c} className="bg-[#0a0d14]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">Role</label>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as TargetRole)}
              className={selectClass}
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#0a0d14]">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">Study Duration</label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <select
              value={duration}
              onChange={(e) => onDurationChange(e.target.value as Duration)}
              className={selectClass}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d} className="bg-[#0a0d14]">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Skills */}
      <div className="mt-4">
        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/50">
          <Code2 className="h-3.5 w-3.5" />
          Current Skills
        </label>
        <div className="flex flex-wrap gap-2">
          {CURRENT_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill)
            return (
              <button
                key={skill}
                type="button"
                onClick={() => onToggleSkill(skill)}
                aria-pressed={isSelected}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                  isSelected
                    ? 'border-blue-500/30 bg-blue-500/14 text-blue-400'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/[0.16] hover:text-white/70'
                }`}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>

      {/* Generate */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={selectedSkills.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <Sparkles className="h-4 w-4" />
          Generate Roadmap
        </button>
      </div>
    </motion.div>
  )
}
