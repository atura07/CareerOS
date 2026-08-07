import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'

export function MissingKeywords({ keywords }: { keywords: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70">
        <Lightbulb className="h-4 w-4 text-amber-400" />
        Suggested Keywords
      </h3>
      <p className="mb-4 text-xs text-white/40">
        Add these keywords to improve your match rate for target roles.
      </p>

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, i) => (
          <motion.span
            key={keyword}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400"
          >
            <Sparkles className="h-3 w-3" />
            {keyword}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}
