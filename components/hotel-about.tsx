import Image from "next/image"
import { Check } from "lucide-react"

export default function HotelAbout() {
  return (
    <div className="relative w-full h-[700px] md:h-[650px] lg:h-[750px]">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={`${process.env.ENV_IMAGE}/images/ROS08603_4_5.jpg`}
          alt="Hotel The Pearl interior with elegant green drapes and comfortable seating"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* White card with content that overlaps the image */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[97%] md:w-[70%] lg:w-[60%] bg-white p-6 md:p-10 rounded-r-3xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-6">About Hotel The Pearl</h1>

        <p className="text-gray-700 text-center text-sm md:text-base mb-4">
          Experience the best of Indian hospitality at Hotel The Pearl, one of the leading economy hotels in India. Our
          boutique hotel in New Delhi offers a blend of fine living, comfort, and affordability.
        </p>

        <p className="text-gray-700 text-center text-sm md:text-base mb-4">
          Conveniently located in City Centre, near Connaught Place, Paharganj Market, and adjacent to the New Delhi
          Railway Station, our hotel provides easy access to the city and beyond.
        </p>

        {/* Features section */}
        <div className="mt-8 w-full max-w-6xl mx-auto px-6">
          <h2 className="text-center text-xl md:text-2xl font-medium text-[#F8AFA6]">
            DESTINATION FOR MEMORABLE EXPERIENCES
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-20 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#f9f5f2] flex items-center justify-center mb-2">
                <Check className="text-[#e9a8a1] w-8 h-8" />
              </div>
              <p className="text-gray-400 text-xs uppercase">SED LACINIA</p>
              <p className="text-gray-700 font-medium text-lg">Best Amenities</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#f9f5f2] flex items-center justify-center mb-2">
                <Check className="text-[#e9a8a1] w-8 h-8" />
              </div>
              <p className="text-gray-400 text-xs uppercase">SED LACINIA</p>
              <p className="text-gray-700 font-medium text-lg">Luxury Rooms</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-[#1e1e2d] text-white px-12 py-4 uppercase text-sm tracking-wider hover:bg-[#2a2a3d] transition-colors">
              Discover More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

