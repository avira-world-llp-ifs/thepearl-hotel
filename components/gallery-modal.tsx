"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface GalleryModalProps {
  images: {
    id: number
    src: string
    alt: string
    title: string
    description: string
  }[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GalleryModal({ images, initialIndex, open, onOpenChange }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const currentImage = images[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    }
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-background/95 backdrop-blur-sm"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative h-full flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-background/50 hover:bg-background/80"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={currentImage.src || "/placeholder.svg"}
                alt={currentImage.alt}
                fill
                className="object-contain"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-4 bg-background">
            <h2 className="text-xl font-bold">{currentImage.title}</h2>
            <p className="text-muted-foreground">{currentImage.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

