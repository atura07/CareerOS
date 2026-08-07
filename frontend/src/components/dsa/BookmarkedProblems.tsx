import { motion } from 'framer-motion'
import { Bookmark, ExternalLink } from 'lucide-react'
import type { Bookmark as BookmarkType } from '../../data/dsa'

interface BookmarkedProblemsProps {
  items: BookmarkType[]
}

const DIFF_STYLES: Record<BookmarkType['difficulty'], string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

export function BookmarkedProblems({ items }: BookmarkedProblemsProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90">
        <Bookmark className="h-4 w-4 text-blue-400" /> Bookmarked Problems
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="group flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-white/80">{item.title}</p>
              <p className="text-xs text-white/40">
                {item.company} · {item.topic} ·{' '}
                <span className={DIFF_STYLES[item.difficulty]}>{item.difficulty}</span>
              </p>
            </div>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              aria-label={`Open ${item.title}`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
