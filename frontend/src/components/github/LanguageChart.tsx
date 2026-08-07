import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import type { LanguageUsage } from '../../data/github'

const LANGUAGE_COLORS: Record<string, string> = {
  Java: '#e76f00',
  'C++': '#f34b7d',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  React: '#61dafb',
  'Spring Boot': '#6db33f',
  SQL: '#e38c00',
}

export function LanguageChart({ languages }: { languages: LanguageUsage[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-4 flex items-center gap-2">
        <Code2 className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white/80">Language Usage</h3>
      </div>

      <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-white/[0.04]">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: LANGUAGE_COLORS[lang.name] ?? '#888' }}
            title={`${lang.name} ${lang.percentage}%`}
          />
        ))}
      </div>

      <ul className="space-y-2">
        {languages.map((lang) => (
          <li key={lang.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: LANGUAGE_COLORS[lang.name] ?? '#888' }}
            />
            <span className="flex-1 text-white/60">{lang.name}</span>
            <span className="font-medium text-white/80">{lang.percentage}%</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
