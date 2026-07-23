const SKELETON_CLASS = 'animate-pulse rounded-lg bg-white/[0.06]'

export function ResumeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
        >
          {/* Icon placeholder */}
          <div className={`mb-4 h-12 w-12 ${SKELETON_CLASS}`} />
          {/* Title */}
          <div className={`mb-2 h-4 w-3/4 ${SKELETON_CLASS}`} />
          {/* Meta lines */}
          <div className={`mb-1 h-3 w-1/2 ${SKELETON_CLASS}`} />
          <div className={`mb-4 h-3 w-2/3 ${SKELETON_CLASS}`} />
          {/* Tags */}
          <div className="flex gap-2">
            <div className={`h-5 w-16 ${SKELETON_CLASS}`} />
            <div className={`h-5 w-20 ${SKELETON_CLASS}`} />
          </div>
          {/* Footer */}
          <div className={`mt-4 h-px w-full bg-white/[0.04]`} />
          <div className="mt-3 flex justify-end gap-2">
            <div className={`h-8 w-8 ${SKELETON_CLASS}`} />
            <div className={`h-8 w-8 ${SKELETON_CLASS}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ResumeListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
        >
          <div className={`h-10 w-10 shrink-0 ${SKELETON_CLASS}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-4 w-1/3 ${SKELETON_CLASS}`} />
            <div className={`h-3 w-1/4 ${SKELETON_CLASS}`} />
          </div>
          <div className={`h-5 w-16 ${SKELETON_CLASS}`} />
          <div className={`h-8 w-8 ${SKELETON_CLASS}`} />
          <div className={`h-8 w-8 ${SKELETON_CLASS}`} />
        </div>
      ))}
    </div>
  )
}

