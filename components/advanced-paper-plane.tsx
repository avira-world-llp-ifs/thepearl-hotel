"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface AdvancedPaperPlaneProps {
  isExiting: boolean
  onAnimationComplete?: () => void
}

export function AdvancedPaperPlane({ isExiting, onAnimationComplete }: AdvancedPaperPlaneProps) {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        setAnimationStep(1)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isExiting])

  useEffect(() => {
    if (animationStep === 1) {
      const timer = setTimeout(() => {
        setAnimationStep(2)
      }, 500)

      return () => clearTimeout(timer)
    }

    if (animationStep === 2) {
      const timer = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [animationStep, onAnimationComplete])

  // Paper folding animation
  if (animationStep === 0) {
    return (
      <motion.div
        className="w-full h-full bg-white"
        initial={{ scale: 1 }}
        animate={{ scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full h-full bg-gradient-to-br from-blue-100 to-white"
          initial={{ rotate: 0 }}
          animate={{ rotate: 15 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>
    )
  }

  // Transforming to paper plane
  if (animationStep === 1) {
    return (
      <motion.div
        className="w-full h-full"
        initial={{ scale: 0.8, rotate: 15 }}
        animate={{
          scale: 0.5,
          rotate: 45,
          borderTopLeftRadius: "50%",
          borderBottomRightRadius: "50%",
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-100" />
      </motion.div>
    )
  }

  // Flying paper plane
  return (
    <motion.div
      className="w-20 h-20"
      initial={{ scale: 0.5, x: 0, y: 0 }}
      animate={{
        scale: 0.2,
        x: isExiting ? window.innerWidth : -window.innerWidth,
        y: -100,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
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
  )
}

