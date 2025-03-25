"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useState, useEffect } from "react"
import { AnimatedPearlLogo } from "./animated-pearl-logo"

interface ClearTwoPhaseTransitionProps {
  children: ReactNode
}

export function ClearTwoPhaseTransition({ children }: ClearTwoPhaseTransitionProps) {
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [prevChildren, setPrevChildren] = useState(children)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showFirstMotion, setShowFirstMotion] = useState(false)
  const [showSecondMotion, setShowSecondMotion] = useState(false)

  // Detect route changes
  useEffect(() => {
    if (pathname !== prevPathname) {
      // Capture current content before changing
      setPrevChildren(children)

      // Start transition
      setIsTransitioning(true)

      // Show first motion (previous page)
      setShowFirstMotion(true)

      // After first motion completes, switch to second motion
      const firstMotionTimer = setTimeout(() => {
        setShowFirstMotion(false)
        setPrevPathname(pathname)

        // Small delay before starting second motion
        setTimeout(() => {
          setShowSecondMotion(true)

          // After second motion completes, end transition
          const secondMotionTimer = setTimeout(() => {
            setShowSecondMotion(false)
            setIsTransitioning(false)
          }, 2000) // Second motion duration

          return () => clearTimeout(secondMotionTimer)
        }, 100) // Small delay between motions
      }, 2000) // First motion duration

      return () => clearTimeout(firstMotionTimer)
    }
  }, [pathname, prevPathname, children])

  return (
    <>
      {/* Transition animations */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-50 to-amber-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="scale-[2] transform opacity-20">
                <AnimatedPearlLogo isDashboardOrAdmin={false} />
              </div>
            </div>

            {/* First Motion - Previous Page Content */}
            <AnimatePresence>
              {showFirstMotion && (
                <motion.div
                  className="w-full h-full overflow-hidden bg-white z-10"
                  initial={{ scale: 1, borderRadius: 0, x: 0, y: 0, rotate: 0 }}
                  animate={[
                    // First shrink
                    {
                      scale: 0.5,
                      borderRadius: "16px",
                      transition: { duration: 0.8 },
                    },
                    // Then fly away
                    {
                      scale: 0.3,
                      x: window.innerWidth,
                      y: -100,
                      rotate: 30,
                      borderRadius: "50% 0 50% 0",
                      transition: {
                        delay: 0.8,
                        duration: 1.2,
                        ease: "easeInOut",
                      },
                    },
                  ]}
                  exit={{
                    x: window.innerWidth * 1.5,
                    opacity: 0,
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Previous page content */}
                  {prevChildren}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Second Motion - Next Page Content */}
            <AnimatePresence>
              {showSecondMotion && (
                <motion.div
                  className="w-full h-full overflow-hidden bg-white z-10"
                  initial={{
                    scale: 0.3,
                    x: -window.innerWidth,
                    y: -100,
                    rotate: 30,
                    borderRadius: "50% 0 50% 0",
                    opacity: 1,
                  }}
                  animate={[
                    // First fly in
                    {
                      scale: 0.5,
                      x: 0,
                      y: 0,
                      rotate: 0,
                      borderRadius: "16px",
                      transition: {
                        duration: 1.2,
                        ease: "easeInOut",
                      },
                    },
                    // Then expand
                    {
                      scale: 1,
                      borderRadius: 0,
                      transition: {
                        delay: 1.2,
                        duration: 0.8,
                      },
                    },
                  ]}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Next page content */}
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular content */}
      <div style={{ display: isTransitioning ? "none" : "block" }}>{children}</div>
    </>
  )
}

