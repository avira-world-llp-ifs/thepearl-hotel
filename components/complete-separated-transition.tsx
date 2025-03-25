"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useState, useEffect } from "react"
import { AnimatedPearlLogo } from "./animated-pearl-logo"

interface CompleteSeparatedTransitionProps {
  children: ReactNode
}

export function CompleteSeparatedTransition({ children }: CompleteSeparatedTransitionProps) {
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [prevChildren, setPrevChildren] = useState<ReactNode>(null)
  const [nextChildren, setNextChildren] = useState<ReactNode>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"idle" | "first" | "second">("idle")

  useEffect(() => {
    if (pathname !== prevPathname) {
      // Capture current content
      setPrevChildren(children)

      // Start transition
      setIsTransitioning(true)
      setCurrentPhase("first")

      // After first phase completes, switch to second phase
      const firstMotionTimer = setTimeout(() => {
        setPrevPathname(pathname)
        setCurrentPhase("second")

        // After second phase completes, end transition
        const secondMotionTimer = setTimeout(() => {
          setCurrentPhase("idle")
          setIsTransitioning(false)
        }, 2000) // Second phase duration

        return () => clearTimeout(secondMotionTimer)
      }, 2000) // First phase duration

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

            {/* First Phase - Previous Page Content */}
            <AnimatePresence>
              {currentPhase === "first" && prevChildren && (
                <motion.div
                  className="w-full h-full overflow-hidden bg-white"
                  initial={{ scale: 1, borderRadius: 0 }}
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
                  exit={{ opacity: 0 }}
                >
                  {prevChildren}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Second Phase - Next Page Content */}
            <AnimatePresence>
              {currentPhase === "second" && children && (
                <motion.div
                  className="w-full h-full overflow-hidden bg-white"
                  initial={{
                    scale: 0.3,
                    x: -window.innerWidth,
                    y: -100,
                    rotate: 30,
                    borderRadius: "50% 0 50% 0",
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
                  exit={{ opacity: 0 }}
                >
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

