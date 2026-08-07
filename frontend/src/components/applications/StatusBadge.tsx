import type { ApplicationStatus } from '../../data/applications'

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Wishlist: 'border-sky-500/30 bg-sky-500/14 text-sky-400',
  Applied: 'border-blue-500/30 bg-blue-500/14 text-blue-400',
  'OA Scheduled': 'border-violet-500/30 bg-violet-500/14 text-violet-400',
  'OA Cleared': 'border-indigo-500/30 bg-indigo-500/14 text-indigo-400',
  'Technical Interview': 'border-amber-500/30 bg-amber-500/14 text-amber-400',
  'HR Interview': 'border-orange-500/30 bg-orange-500/14 text-orange-400',
  Offer: 'border-emerald-500/30 bg-emerald-500/14 text-emerald-400',
  Rejected: 'border-rose-500/30 bg-rose-500/14 text-rose-400',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
