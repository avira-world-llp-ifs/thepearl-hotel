"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function RoomSlider() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Sample gallery images - replace with your actual data
  const galleryImages = [
    {
      src: "/images/ROS08981_2_3.jpg?height=750&width=1000&text=Luxury+Suite",
      alt: "Luxury Suite",
      caption: "Luxury Suite",
    },
    {
      src: "/images/ROS08849_50_51.jpg?height=750&width=1000&text=Deluxe+Room",
      alt: "Deluxe Room",
      caption: "Deluxe Room",
    },
    {
      src: "/images/ROS08936_7_8.jpg?height=750&width=1000&text=Executive+Suite",
      alt: "Executive Suite",
      caption: "Executive Suite",
    },
    {
      src: "/images/ROS08900_1_2.jpg?height=750&width=1000&text=Presidential+Suite",
      alt: "Presidential Suite",
      caption: "Presidential Suite",
    },
    {
      src: "/images/ROS08819_20_21.jpg?height=750&width=1000&text=Family+Room",
      alt: "Family Room",
      caption: "Family Room",
    },
  ]

  return (
    <section className="pt-10 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">Explore Our Rooms and Suites</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take a visual tour of our luxurious accommodations and amenities. Each room is designed with your comfort in
            mind.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="rounded-xl overflow-hidden"
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative overflow-hidden cursor-pointer group h-[500px] rounded-xl"
                  onClick={() => setSelectedImage(image.src)}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white w-8 h-8" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-lg font-medium">{image.caption}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <div className="swiper-button-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white text-[#4a4a4a] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <div className="swiper-button-next absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white text-[#4a4a4a] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl max-h-[90vh]">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Enlarged view"
                width={1200}
                height={900}
                className="object-contain max-h-[90vh]"
              />
              <button
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/#"
            className="inline-block border-2 border-[#b18c57] text-[#b18c57] px-8 py-3 rounded-full hover:bg-[#b18c57] hover:text-white transition-colors"
          >
            VIEW FULL GALLERY
          </Link>
        </div>
      </div>
    </section>
  )
}

