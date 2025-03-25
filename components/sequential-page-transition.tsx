"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface SequentialPageTransitionProps {
  children: ReactNode
}

export function SequentialPageTransition({ children }: SequentialPageTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [nextPathname, setNextPathname] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(true)
  const [animationPhase, setAnimationPhase] = useState<"idle" | "folding" | "flying" | "unfolding">("idle")

  // Store the original push method
  useEffect(() => {
    // Override the router's push method to capture navigation
    const originalPush = router.push

    // @ts-ignore - We're monkey patching for a specific purpose
    router.push = (href: string, options?: any) => {
      // Start animation sequence
      setIsAnimating(true)
      setNextPathname(href)
      setAnimationPhase("folding")

      // Don't navigate immediately - we'll do it after animation
      return Promise.resolve(true)
    }

    return () => {
      // Restore original method when component unmounts
      // @ts-ignore
      router.push = originalPush
    }
  }, [router])

  // Handle animation phases
  useEffect(() => {
    if (!isAnimating) return

    if (animationPhase === "folding") {
      // Hide current content and start folding animation
      setShowContent(false)

      // Move to flying phase after folding completes
      const timer = setTimeout(() => {
        setAnimationPhase("flying")
      }, 800)

      return () => clearTimeout(timer)
    }

    if (animationPhase === "flying") {
      // Start flying animation
      const timer = setTimeout(() => {
        // Actually navigate to the new page
        if (nextPathname) {
          // Use the original push method
          window.location.href = nextPathname
          setAnimationPhase("unfolding")
        }
      }, 1000)

      return () => clearTimeout(timer)
    }

    if (animationPhase === "unfolding") {
      // Start unfolding animation after navigation
      const timer = setTimeout(() => {
        setShowContent(true)
        setIsAnimating(false)
        setAnimationPhase("idle")
        setNextPathname(null)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isAnimating, animationPhase, nextPathname, router])

  return (
    <div className="relative w-full min-h-screen">
      {/* Paper plane animation overlay */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Folding animation */}
            {animationPhase === "folding" && (
              <motion.div
                className="w-64 h-64 bg-gradient-to-br from-blue-100 to-white"
                initial={{ scale: 1, borderRadius: 0 }}
                animate={{
                  scale: 0.8,
                  borderRadius: 16,
                  rotateZ: 15,
                }}
                transition={{ duration: 0.8 }}
              />
            )}

            {/* Flying animation */}
            {animationPhase === "flying" && (
              <motion.div
                className="w-64 h-64"
                initial={{
                  scale: 0.8,
                  borderRadius: 16,
                  rotateZ: 15,
                  x: 0,
                }}
                animate={{
                  scale: 0.5,
                  borderRadius: "50% 0 50% 0",
                  rotateZ: 45,
                  x: window.innerWidth,
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path
                    d="M21.9999 2.00001L2 9.00001L11.5 12.5L15 22L21.9999 2.00001Z"
                    fill="#3B82F6"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12.5L21.9999 2.00001"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}

            {/* Unfolding animation */}
            {animationPhase === "unfolding" && (
              <motion.div
                className="w-64 h-64"
                initial={{
                  scale: 0.5,
                  borderRadius: "50% 0 50% 0",
                  rotateZ: 45,
                  x: -window.innerWidth,
                }}
                animate={{
                  scale: 1,
                  borderRadius: 0,
                  rotateZ: 0,
                  x: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-white" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

