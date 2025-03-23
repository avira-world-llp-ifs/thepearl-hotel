"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HotelAbout() {
  const [imagePath, setImagePath] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set the image path from environment variable
    const envImage = process.env.NEXT_PUBLIC_ENV_IMAGE || ""
    setImagePath(envImage)
    setIsLoaded(true)
    console.log("Hotel About - Environment image path:", envImage) // Debug log
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="w-full h-[500px] relative rounded-lg overflow-hidden">
                {isLoaded && (
                  <Image
                    src={`${imagePath}/images/ROS08981_2_3.jpg`}
                    alt="The Pearl Hotel"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-lg shadow-lg w-48 h-48 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#b18c57]">25</span>
                <span className="text-gray-600 text-center">Years of Excellence</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-16 lg:mt-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-[#b18c57]"></div>
              <span className="text-[#b18c57] font-medium uppercase tracking-wider text-sm">About The Pearl</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">Experience Luxury Like Never Before</h2>

            <p className="text-gray-600 mb-6">
              Welcome to The Pearl, where luxury meets comfort in the heart of the city. Our hotel offers an
              unparalleled experience with meticulously designed rooms, world-class amenities, and personalized service
              that caters to your every need.
            </p>

            <p className="text-gray-600 mb-8">
              Since our establishment in 1998, we have been dedicated to providing our guests with memorable stays that
              combine elegant surroundings, exceptional dining, and thoughtful attention to detail. Whether you're
              traveling for business or leisure, The Pearl promises an experience that exceeds expectations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-bold mb-2">Luxurious Accommodations</h3>
                <p className="text-gray-600">
                  Our rooms and suites are designed with your comfort in mind, featuring premium bedding and modern
                  amenities.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Fine Dining Experience</h3>
                <p className="text-gray-600">
                  Indulge in culinary delights at our restaurants, offering a blend of local and international cuisine.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Premium Amenities</h3>
                <p className="text-gray-600">
                  Enjoy our spa, fitness center, swimming pool, and other facilities designed for your relaxation and
                  enjoyment.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Prime Location</h3>
                <p className="text-gray-600">
                  Situated in the heart of the city, with easy access to major attractions, shopping, and business
                  districts.
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center text-[#b18c57] font-medium uppercase tracking-wider text-sm hover:text-[#9a7848] transition-colors"
            >
              <span className="mr-2">LEARN MORE ABOUT US</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

