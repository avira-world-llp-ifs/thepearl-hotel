"use client"

import { useState } from "react"
import Link from "next/link"

interface FancyLogoProps {
  text: string
  className?: string
  isDashboardOrAdmin?: boolean
}

export function FancyLogo({ text, className = "", isDashboardOrAdmin = false }: FancyLogoProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const baseTextColor = isDashboardOrAdmin ? "text-gray-800" : "text-amber-500"
  const hoverTextColor = "text-blue-500"

  return (
    <Link href="/">
      <div className={`flex text-2xl font-bold ${className} ${baseTextColor}`}>
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className={`relative inline-block transition-all duration-300 transform ${
              hoveredIndex === index ? `${hoverTextColor} scale-110` : ""
            }`}
            style={{
              transformOrigin: "bottom center",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onAnimationEnd={() => setHoveredIndex(null)}
          >
            {letter === " " ? (
              <span className="inline-block w-2"></span>
            ) : (
              <>
                {letter}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 ${
                    hoveredIndex === index ? "bg-blue-500 scale-x-100" : "scale-x-0"
                  } transition-transform duration-300`}
                ></span>
              </>
            )}
          </span>
        ))}
      </div>
    </Link>
  )
}

