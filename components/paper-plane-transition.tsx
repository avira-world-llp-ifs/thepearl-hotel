"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useState, useEffect } from "react"

interface PaperPlaneTransitionProps {
  children: ReactNode
}

export function PaperPlaneTransition({ children }: PaperPlaneTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [prevChildren, setPrevChildren] = useState<ReactNode>(null)
  const [currentPathname, setCurrentPathname] = useState(pathname)

  useEffect(() => {
    if (pathname !== currentPathname) {
      setIsTransitioning(true)
      setPrevChildren(children)

      // Update pathname after animation completes
      const timer = setTimeout(() => {
        setCurrentPathname(pathname)
        setIsTransitioning(false)
      }, 1500) // Match this with the total animation duration

      return () => clearTimeout(timer)
    }
  }, [pathname, children, currentPathname])

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <div key="transition" className="fixed inset-0 z-50 overflow-hidden">
            {/* Paper being folded and flying out */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1,
                clipPath: [
                  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Full page
                  "polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)", // Shrinking to center
                  "polygon(40% 30%, 60% 30%, 60% 70%, 40% 70%)", // Smaller rectangle
                  "polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)", // Diamond shape
                ],
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="h-full w-full flex items-center justify-center">{prevChildren}</div>
            </motion.div>

            {/* Paper plane flying */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 z-50"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 1, 0.5, 0],
                rotate: [0, 0, 45, 30, 0],
                x: [0, 0, 100, window.innerWidth],
                y: [0, 0, -50, -100],
              }}
              transition={{
                duration: 1,
                times: [0, 0.2, 0.4, 0.6, 1],
                delay: 0.5,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>
        ) : (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Incoming paper plane */}
            <AnimatePresence>
              {pathname !== currentPathname && (
                <motion.div
                  className="fixed top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 z-50"
                  initial={{
                    scale: 0.5,
                    x: -window.innerWidth,
                    y: -100,
                    rotate: 30,
                  }}
                  animate={{
                    scale: [0.5, 1, 1, 0],
                    rotate: [30, 45, 0, 0],
                    x: [-window.innerWidth, -100, 0, 0],
                    y: [-100, -50, 0, 0],
                  }}
                  transition={{
                    duration: 1,
                    times: [0, 0.4, 0.6, 1],
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </AnimatePresence>

            {/* Page unfolding */}
            <motion.div
              className="w-full h-full"
              initial={{
                clipPath: "polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)", // Diamond shape
              }}
              animate={{
                clipPath: [
                  "polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)", // Diamond shape
                  "polygon(40% 30%, 60% 30%, 60% 70%, 40% 70%)", // Small rectangle
                  "polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)", // Larger rectangle
                  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Full page
                ],
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                delay: pathname !== currentPathname ? 1 : 0,
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

