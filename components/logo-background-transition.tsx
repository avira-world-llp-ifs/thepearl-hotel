"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useState, useEffect } from "react"
import { AnimatedPearlLogo } from "./animated-pearl-logo"

interface LogoBackgroundTransitionProps {
  children: ReactNode
}

export function LogoBackgroundTransition({ children }: LogoBackgroundTransitionProps) {
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [prevChildren, setPrevChildren] = useState(children)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<
    "idle" | "shrinking" | "flying-out" | "flying-in" | "expanding"
  >("idle")

  // Detect route changes
  useEffect(() => {
    if (pathname !== prevPathname) {
      // Start transition
      setPrevChildren(children)
      setIsTransitioning(true)
      setTransitionPhase("shrinking")

      // Schedule phases
      const shrinkTimer = setTimeout(() => {
        setTransitionPhase("flying-out")

        const flyOutTimer = setTimeout(() => {
          setPrevPathname(pathname)
          setTransitionPhase("flying-in")

          const flyInTimer = setTimeout(() => {
            setTransitionPhase("expanding")

            const expandTimer = setTimeout(() => {
              setIsTransitioning(false)
              setTransitionPhase("idle")
            }, 800) // Expanding duration

            return () => clearTimeout(expandTimer)
          }, 1000) // Flying in duration

          return () => clearTimeout(flyInTimer)
        }, 1000) // Flying out duration

        return () => clearTimeout(flyOutTimer)
      }, 800) // Shrinking duration

      return () => clearTimeout(shrinkTimer)
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
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="scale-[3] transform">
                <AnimatedPearlLogo isDashboardOrAdmin={false} />
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-amber-100 opacity-20 blur-xl"></div>
              <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-blue-100 opacity-20 blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-50 opacity-10 blur-xl"></div>
            </div>

            {/* Shrinking content */}
            {transitionPhase === "shrinking" && (
              <motion.div
                className="w-full h-full overflow-hidden bg-white rounded-none shadow-xl z-10"
                initial={{ scale: 1, borderRadius: 0 }}
                animate={{
                  scale: 0.5,
                  width: "80%",
                  height: "80%",
                  borderRadius: "16px",
                }}
                transition={{ duration: 0.8 }}
              >
                {prevChildren}
              </motion.div>
            )}

            {/* Flying out */}
            {transitionPhase === "flying-out" && (
              <motion.div
                className="w-[40%] h-[40%] overflow-hidden bg-white shadow-xl z-10"
                initial={{
                  scale: 0.5,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  borderRadius: "16px",
                }}
                animate={{
                  scale: 0.3,
                  x: window.innerWidth,
                  y: -100,
                  rotate: 30,
                  borderRadius: "50% 0 50% 0",
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <div className="w-full h-full scale-[2]">{prevChildren}</div>
              </motion.div>
            )}

            {/* Flying in */}
            {transitionPhase === "flying-in" && (
              <motion.div
                className="w-[40%] h-[40%] overflow-hidden bg-white shadow-xl z-10"
                initial={{
                  scale: 0.3,
                  x: -window.innerWidth,
                  y: -100,
                  rotate: 30,
                  borderRadius: "50% 0 50% 0",
                }}
                animate={{
                  scale: 0.5,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  borderRadius: "16px",
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <div className="w-full h-full scale-[2]">{children}</div>
              </motion.div>
            )}

            {/* Expanding */}
            {transitionPhase === "expanding" && (
              <motion.div
                className="overflow-hidden bg-white shadow-xl z-10"
                initial={{
                  scale: 0.5,
                  width: "80%",
                  height: "80%",
                  borderRadius: "16px",
                }}
                animate={{
                  scale: 1,
                  width: "100%",
                  height: "100%",
                  borderRadius: 0,
                }}
                transition={{ duration: 0.8 }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular content */}
      <div style={{ display: isTransitioning ? "none" : "block" }}>{children}</div>
    </>
  )
}

