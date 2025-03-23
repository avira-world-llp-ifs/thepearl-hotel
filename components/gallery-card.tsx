"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { GalleryModal } from "@/components/gallery-modal"

interface GalleryImage {
  id: number
  src: string
  alt: string
  title: string
  description: string
  category: string
}

interface GalleryCardProps {
  image: GalleryImage
  images: GalleryImage[]
}

export function GalleryCard({ image, images }: GalleryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const imageIndex = images.findIndex((img) => img.id === image.id)

  return (
    <>
      <Card className="overflow-hidden group cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image.src || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{image.title}</h3>
          <p className="text-sm text-muted-foreground">{image.description}</p>
        </CardContent>
      </Card>

      <GalleryModal images={images} initialIndex={imageIndex} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}

