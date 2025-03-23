"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function HomeGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = [
    {
      src: "/images/ROS09257_8_9.jpg",
      alt: "The Pearl Hotel Exterior",
    },
    {
      src: "/images/pearlspa.jpg",
      alt: "The Pearl Hotel Spa",
    },
    {
      src: "/images/pearlrestraunt.jpg",
      alt: "The Pearl Hotel Restaurant",
    },
    {
      src: "/images/ROS08987_8_9.jpg",
      alt: "The Pearl Hotel Room",
    },
    {
      src: "/images/pearlpool.jpg",
      alt: "The Pearl Hotel Pool",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto my-12 overflow-hidden rounded-lg shadow-xl">
      <div className="relative h-[500px] w-full">
        <Image
          src={images[currentIndex].src || "/placeholder.svg"}
          alt={images[currentIndex].alt}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white p-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Luxury at The Pearl</h2>
            <p className="text-lg md:text-xl mb-6">Discover our world-class amenities and accommodations</p>
            <Link
              href="/gallery"
              className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 transition-all"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

