"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useState, useEffect, useRef } from "react"
import { AnimatedPearlLogo } from "./animated-pearl-logo"

interface SeparatedPhaseTransitionProps {
  children: ReactNode
}

export function SeparatedPhaseTransition({ children }: SeparatedPhaseTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [prevChildren, setPrevChildren] = useState<ReactNode>(null)
  const [nextChildren, setNextChildren] = useState<ReactNode>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"idle" | "first" | "second">("idle")
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Override navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a") as HTMLAnchorElement

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.href.includes("#") &&
        anchor.href !== window.location.href
      ) {
        e.preventDefault()

        // Extract the pathname from the href
        const url = new URL(anchor.href)
        const newPath = url.pathname

        // Start transition
        startTransition(newPath)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [pathname])

  // Start the transition process
  const startTransition = (newPath: string) => {
    if (isTransitioning) return

    // Capture current content
    setPrevChildren(children)
    setTargetPath(newPath)
    setIsTransitioning(true)

    // Start first phase (previous page)
    setCurrentPhase("first")

    // After first phase completes, navigate and start second phase
    setTimeout(() => {
      // Navigate to new page (but don't show it yet)
      window.history.pushState({}, "", newPath)

      // Force a re-render to load the new page content
      router.refresh()

      // Wait for content to load, then start second phase
      setTimeout(() => {
        setNextChildren(children)
        setCurrentPhase("second")

        // After second phase completes, end transition
        setTimeout(() => {
          setCurrentPhase("idle")
          setIsTransitioning(false)
          setPrevPathname(newPath)
          setPrevChildren(null)
          setNextChildren(null)
          setTargetPath(null)
        }, 2000) // Second phase duration
      }, 100) // Small delay to ensure content is loaded
    }, 2000) // First phase duration
  }

  return (
    <>
      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-50 to-amber-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  className="absolute inset-0 overflow-hidden bg-white"
                  initial={{ scale: 1, borderRadius: 0 }}
                  animate={[
                    // First shrink
                    {
                      scale: 0.5,
                      borderRadius: "16px",
                      transition: { duration: 0.8 },
                    },
                    // Then transform and fly away
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
              {currentPhase === "second" && nextChildren && (
                <motion.div
                  className="absolute inset-0 overflow-hidden bg-white"
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
                  {nextChildren}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular content (hidden during transition) */}
      <div
        ref={contentRef}
        style={{
          visibility: isTransitioning ? "hidden" : "visible",
          position: isTransitioning ? "absolute" : "relative",
          zIndex: isTransitioning ? -1 : "auto",
        }}
      >
        {children}
      </div>
    </>
  )
}

