"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface ContentPlaneTransitionProps {
  children: ReactNode
}

export function ContentPlaneTransition({ children }: ContentPlaneTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [prevChildren, setPrevChildren] = useState<ReactNode>(children)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextPath, setNextPath] = useState<string | null>(null)
  const [capturedContent, setCapturedContent] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Capture screenshot of current content
  const captureContent = () => {
    if (contentRef.current) {
      // In a real implementation, you would use html2canvas or a similar library
      // For this demo, we'll just use the content as-is
      setCapturedContent("captured")
      return true
    }
    return false
  }

  // Handle link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkElement = target.closest("a")

      if (linkElement && linkElement.getAttribute("href")?.startsWith("/")) {
        const href = linkElement.getAttribute("href")

        // Don't intercept if it's the current page
        if (href === pathname) return

        e.preventDefault()

        // Capture current content
        if (captureContent()) {
          setPrevChildren(children)
          setNextPath(href)
          setIsTransitioning(true)
        } else {
          // Fallback if capture fails
          window.location.href = href
        }
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [pathname, children])

  // Handle transition sequence
  useEffect(() => {
    if (!isTransitioning || !nextPath) return

    // After content shrinks and flies away, navigate to new page
    const timer = setTimeout(() => {
      window.location.href = nextPath

      // Reset state after navigation
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false)
        setNextPath(null)
        setCapturedContent(null)
      }, 2000) // Allow time for entrance animation

      return () => clearTimeout(resetTimer)
    }, 2000) // Allow time for exit animation

    return () => clearTimeout(timer)
  }, [isTransitioning, nextPath])

  return (
    <>
      {/* Exit animation with current content */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Content shrinking */}
            <motion.div
              className="relative overflow-hidden bg-white"
              initial={{
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
                scale: 1,
              }}
              animate={[
                // Step 1: Shrink
                {
                  width: "400px",
                  height: "300px",
                  borderRadius: "16px",
                  scale: 1,
                  transition: { duration: 0.8 },
                },
                // Step 2: Transform to plane and fly away
                {
                  scale: 0.8,
                  x: window.innerWidth,
                  y: -100,
                  rotate: 15,
                  borderRadius: "50% 0 50% 0",
                  transition: {
                    delay: 0.8,
                    duration: 1.2,
                    ease: "easeInOut",
                  },
                },
              ]}
            >
              <div className="w-full h-full relative">{prevChildren}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular content when not transitioning */}
      <div ref={contentRef} style={{ opacity: isTransitioning ? 0 : 1 }}>
        {children}
      </div>
    </>
  )
}

