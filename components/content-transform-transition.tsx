"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useState, useEffect, useRef } from "react"

interface ContentTransformTransitionProps {
  children: ReactNode
}

export function ContentTransformTransition({ children }: ContentTransformTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [prevChildren, setPrevChildren] = useState<ReactNode>(children)
  const [nextChildren, setNextChildren] = useState<ReactNode>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "shrinking" | "plane-exit" | "plane-entrance" | "expanding"
  >("idle")
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Override navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkElement = target.closest("a")

      if (linkElement && linkElement.getAttribute("href")?.startsWith("/")) {
        const href = linkElement.getAttribute("href")

        // Don't intercept if it's the current page
        if (href === pathname) return

        e.preventDefault()

        // Start transition
        setIsTransitioning(true)
        setAnimationPhase("shrinking")
        setPrevChildren(children)
        setTargetPath(href)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [pathname, children, router])

  // Handle animation phases
  useEffect(() => {
    if (!isTransitioning) return

    if (animationPhase === "shrinking") {
      // After shrinking, move to plane exit
      const timer = setTimeout(() => {
        setAnimationPhase("plane-exit")
      }, 800)
      return () => clearTimeout(timer)
    }

    if (animationPhase === "plane-exit") {
      // After plane exits, navigate and prepare entrance
      const timer = setTimeout(() => {
        if (targetPath) {
          // Navigate to new page
          window.location.href = targetPath

          // Prepare for entrance animation
          setAnimationPhase("plane-entrance")
        }
      }, 1000)
      return () => clearTimeout(timer)
    }

    if (animationPhase === "plane-entrance") {
      // After plane enters, start expanding
      const timer = setTimeout(() => {
        setAnimationPhase("expanding")
      }, 1000)
      return () => clearTimeout(timer)
    }

    if (animationPhase === "expanding") {
      // After expanding, finish transition
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setAnimationPhase("idle")
        setTargetPath(null)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, animationPhase, targetPath])

  return (
    <div className="relative min-h-screen">
      {/* Current content that transforms */}
      <AnimatePresence>
        {isTransitioning && (animationPhase === "shrinking" || animationPhase === "plane-exit") ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Content container that shrinks */}
            {animationPhase === "shrinking" && (
              <motion.div
                className="relative w-full h-full overflow-hidden"
                initial={{ scale: 1, borderRadius: 0 }}
                animate={{
                  scale: 0.5,
                  borderRadius: "16px",
                  width: "400px",
                  height: "300px",
                }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 scale-[0.5] origin-center">{prevChildren}</div>
              </motion.div>
            )}

            {/* Paper plane that flies away */}
            {animationPhase === "plane-exit" && (
              <motion.div
                className="w-64 h-48 bg-white overflow-hidden"
                initial={{
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  borderRadius: "16px",
                }}
                animate={{
                  scale: 0.8,
                  x: window.innerWidth,
                  y: -100,
                  rotate: 15,
                  borderRadius: "50% 0 50% 0",
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <foreignObject width="400" height="300" className="overflow-hidden">
                    <div className="w-[400px] h-[300px] relative">
                      <div className="absolute inset-0 scale-[0.5] origin-center">{prevChildren}</div>
                    </div>
                  </foreignObject>
                </svg>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* New content that appears from plane */}
      <AnimatePresence>
        {isTransitioning && (animationPhase === "plane-entrance" || animationPhase === "expanding") ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Paper plane that flies in */}
            {animationPhase === "plane-entrance" && (
              <motion.div
                className="w-64 h-48 bg-white overflow-hidden"
                initial={{
                  scale: 0.8,
                  x: -window.innerWidth,
                  y: -100,
                  rotate: 15,
                  borderRadius: "50% 0 50% 0",
                }}
                animate={{
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  borderRadius: "16px",
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <foreignObject width="400" height="300" className="overflow-hidden">
                    <div className="w-[400px] h-[300px] relative">
                      <div className="absolute inset-0 scale-[0.5] origin-center">{children}</div>
                    </div>
                  </foreignObject>
                </svg>
              </motion.div>
            )}

            {/* Content expanding */}
            {animationPhase === "expanding" && (
              <motion.div
                className="relative w-[400px] h-[300px] overflow-hidden"
                initial={{
                  scale: 1,
                  borderRadius: "16px",
                  width: "400px",
                  height: "300px",
                }}
                animate={{
                  scale: 1,
                  borderRadius: 0,
                  width: "100%",
                  height: "100%",
                }}
                transition={{ duration: 0.8 }}
              >
                <div
                  className="absolute inset-0 scale-[0.5] origin-center transition-all duration-800 ease-in-out"
                  style={{
                    transform: animationPhase === "expanding" ? "scale(1)" : "scale(0.5)",
                  }}
                >
                  {children}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Regular content display when not transitioning */}
      {!isTransitioning && <div ref={contentRef}>{children}</div>}
    </div>
  )
}

