"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface LayoutTransitionProps {
  children: ReactNode
}

export function LayoutTransition({ children }: LayoutTransitionProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full">
      {children}
    </motion.div>
  )
}

