import { motion } from 'framer-motion'
import { CheckSquare, Square } from 'lucide-react'
import type { SkillName } from '../../data/roadmap'

interface SkillChecklistProps {
  skills: SkillName[]
  checked: SkillName[]
  onToggle: (skill: SkillName) => void
}

export function SkillChecklist({ skills, checked, onToggle }: SkillChecklistProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 text-sm font-semibold text-white/90">Skill Checklist</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {skills.map((skill, i) => {
          const isChecked = checked.includes(skill)
          return (
            <motion.button
              key={skill}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              onClick={() => onToggle(skill)}
              aria-pressed={isChecked}
              className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left text-sm text-white/70 transition-colors hover:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              {isChecked ? (
                <CheckSquare className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <Square className="h-4 w-4 shrink-0 text-white/30" />
              )}
              <span className={isChecked ? 'text-emerald-300' : ''}>{skill}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
