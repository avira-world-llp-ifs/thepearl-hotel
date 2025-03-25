"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useState, useEffect } from "react"
import { AdvancedPaperPlane } from "./advanced-paper-plane"

interface EnhancedPageTransitionProps {
  children: ReactNode
}

export function EnhancedPageTransition({ children }: EnhancedPageTransitionProps) {
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showExitPlane, setShowExitPlane] = useState(false)
  const [showEntrancePlane, setShowEntrancePlane] = useState(false)

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsTransitioning(true)
      setShowExitPlane(true)

      // Schedule the entrance animation
      const timer = setTimeout(() => {
        setPrevPathname(pathname)
        setShowExitPlane(false)
        setShowEntrancePlane(true)
      }, 2000) // Adjust timing as needed

      return () => clearTimeout(timer)
    }
  }, [pathname, prevPathname])

  const handleEntranceComplete = () => {
    setShowEntrancePlane(false)
    setIsTransitioning(false)
  }

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="transition"
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showExitPlane && (
              <AdvancedPaperPlane isExiting={true} onAnimationComplete={() => setShowExitPlane(false)} />
            )}

            {showEntrancePlane && <AdvancedPaperPlane isExiting={false} onAnimationComplete={handleEntranceComplete} />}
          </motion.div>
        ) : (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

