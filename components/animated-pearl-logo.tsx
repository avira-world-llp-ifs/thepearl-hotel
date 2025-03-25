"use client"

import { motion } from "framer-motion"

interface AnimatedPearlLogoProps {
  isDashboardOrAdmin?: boolean
}

export function AnimatedPearlLogo({ isDashboardOrAdmin = false }: AnimatedPearlLogoProps) {
  const letters = "ThePearl".split("")

  return (
    <div className="flex items-center justify-center">
      {letters.map((letter, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: index * 0.1,
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: 2,
            },
          }}
          className={`text-3xl font-bold ${isDashboardOrAdmin ? "text-white" : "text-primary"}`}
        >
          {letter}
        </motion.div>
      ))}
    </div>
  )
}

