"use client"

import { motion } from "framer-motion"

export function MotionLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <motion.div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}

