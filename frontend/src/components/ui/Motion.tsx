import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

export function MotionDiv({
  children,
  ...props
}: PropsWithChildren<React.ComponentProps<typeof motion.div>>) {
  return <motion.div {...props}>{children}</motion.div>
}

