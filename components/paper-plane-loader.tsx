"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface PaperPlaneLoaderProps {
  show: boolean
  phase: "exit" | "entrance"
  onComplete?: () => void
}

export function PaperPlaneLoader({ show, phase, onComplete }: PaperPlaneLoaderProps) {
  const [animationStep, setAnimationStep] = useState<"initial" | "folding" | "flying" | "complete">("initial")

  useEffect(() => {
    if (!show) {
      setAnimationStep("initial")
      return
    }

    // Start the animation sequence
    setAnimationStep("folding")

    const foldingTimer = setTimeout(() => {
      setAnimationStep("flying")

      const flyingTimer = setTimeout(() => {
        setAnimationStep("complete")
        if (onComplete) onComplete()
      }, 1000) // Flying duration

      return () => clearTimeout(flyingTimer)
    }, 800) // Folding duration

    return () => clearTimeout(foldingTimer)
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Folding animation */}
      {animationStep === "folding" && (
        <motion.div
          className="w-64 h-64 bg-gradient-to-br from-blue-100 to-white"
          initial={{
            scale: phase === "exit" ? 1 : 0.5,
            borderRadius: phase === "exit" ? 0 : "50% 0 50% 0",
            rotate: phase === "exit" ? 0 : 45,
          }}
          animate={{
            scale: phase === "exit" ? 0.5 : 1,
            borderRadius: phase === "exit" ? "50% 0 50% 0" : 0,
            rotate: phase === "exit" ? 45 : 0,
          }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* Flying animation */}
      {animationStep === "flying" && (
        <motion.div
          className="w-64 h-64"
          initial={{
            scale: 0.5,
            x: phase === "exit" ? 0 : -window.innerWidth,
            rotate: 45,
          }}
          animate={{
            x: phase === "exit" ? window.innerWidth : 0,
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
    </div>
  )
}

