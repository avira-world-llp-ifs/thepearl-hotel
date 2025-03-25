"use client"

import { motion } from "framer-motion"

export function TransitionLogo() {
  const letters = "ThePearl".split("")

  return (
    <div className="flex items-center justify-center">
      <div className="text-4xl font-bold text-amber-500 flex">
        {letters.map((letter, index) => (
          <motion.span
            key={`logo-${index}`}
            className="inline-block"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

