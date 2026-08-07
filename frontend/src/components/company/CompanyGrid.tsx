import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { CompanyCard } from './CompanyCard'
import type { Company } from '../../data/companies'

interface CompanyGridProps {
  companies: Company[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
}

export function CompanyGrid({ companies }: CompanyGridProps) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
          <Building2 className="h-6 w-6 text-white/30" />
        </div>
        <p className="text-sm font-medium text-white/60">No companies found</p>
        <p className="mt-1 text-xs text-white/40">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </motion.div>
  )
}
