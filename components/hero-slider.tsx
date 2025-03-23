"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface HeroSliderProps {
  slides: string[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/30 z-[1]"></div>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={slide || "/placeholder.svg"}
              alt={`Hero slide ${index + 1}`}
              fill
              priority={index === 0}
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                currentSlide === index ? "scale-110" : "scale-100"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

