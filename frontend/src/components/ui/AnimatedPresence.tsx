import { AnimatePresence } from 'framer-motion'
import type { AnimatePresenceProps } from 'framer-motion'
import type { ReactNode } from 'react'

export function AnimatedPresence({
  children,
  ...props
}: { children: ReactNode } & AnimatePresenceProps) {
  return (
    <AnimatePresence {...props}>
      {children}
    </AnimatePresence>
  )
}

