"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ChevronUp, MapPinned, Check } from "lucide-react"
import EnquiryForm from "@/components/enquiry-form"
import RoomSlider from "@/components/gallery"
import HeroSlider from "@/components/hero-slider"
import { getImagePath } from "@/utils/image-path"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
})

// Update the HotelAbout component to properly implement Montserrat font on all text elements

function HotelAbout() {
  return (
    <div
      className={`relative w-full h-[700px] md:h-[600px] lg:h-[650px] ${montserrat.className} mt-5 md:mt-0`}
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_ENV_IMAGE}/images/ROS08603_4_5.jpg`}
          alt="Hotel The Pearl interior with elegant green drapes and comfortable seating"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* White card with content that overlaps the image */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[97%] md:w-[70%] lg:w-[60%] bg-white p-5 md:p-6 lg:p-7 rounded-r-3xl shadow-lg">
        <h1
          className={`text-3xl md:text-4xl font-bold text-center mb-4 md:mb-5 ${montserrat.className}`}
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          About Hotel The Pearl
        </h1>

        <p
          className={`text-gray-700 text-center text-sm md:text-base mb-3 ${montserrat.className}`}
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Experience the best of Indian hospitality at Hotel The Pearl, one of the leading economy hotels in India. Our
          boutique hotel in New Delhi offers a blend of fine living, comfort, and affordability.
        </p>

        <p
          className={`text-gray-700 text-center text-sm md:text-base mb-3 ${montserrat.className}`}
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Conveniently located in City Centre, near Connaught Place, Paharganj Market, and adjacent to the New Delhi
          Railway Station, our hotel provides easy access to the city and beyond.
        </p>

        {/* Features section */}
        <div className="mt-4 md:mt-3 w-full max-w-6xl mx-auto px-4 md:px-2">
          <h2
            className={`text-center text-xl md:text-2xl font-medium text-[#F8AFA6] ${montserrat.className}`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            DESTINATION FOR MEMORABLE EXPERIENCES
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-16 my-5">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f9f5f2] flex items-center justify-center mb-2">
                <Check className="text-[#e9a8a1] w-7 h-7" />
              </div>
              <p
                className={`text-gray-700 font-medium text-lg ${montserrat.className}`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Best Amenities
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f9f5f2] flex items-center justify-center mb-2">
                <Check className="text-[#e9a8a1] w-7 h-7" />
              </div>
              <p
                className={`text-gray-700 font-medium text-lg ${montserrat.className}`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Luxury Rooms
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              className={`bg-[#1e1e2d] text-white px-10 py-3 uppercase text-sm tracking-wider hover:bg-[#2a2a3d] transition-colors ${montserrat.className}`}
              style={{ fontFamily: "var(--font-montserrat)" }}
              onClick={() => (window.location.href = "/rooms")}
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false) // Set to false to play video first
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imagePath, setImagePath] = useState("")
  const fontApplied = useRef(false)

  useEffect(() => {
    // Set the base image path from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_ENV_IMAGE || ""
    setImagePath(baseUrl)
  }, [])

  useEffect(() => {
    if (!fontApplied.current) {
      // Apply Montserrat font to all elements via CSS
      document.documentElement.style.setProperty("font-family", "var(--font-montserrat), sans-serif")

      // Add a style tag to ensure all elements use Montserrat
      const style = document.createElement("style")
      style.textContent = `
        * {
          font-family: var(--font-montserrat), sans-serif !important;
        }
        h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea, select, label {
          font-family: var(--font-montserrat), sans-serif !important;
        }
      `
      document.head.appendChild(style)

      fontApplied.current = true // Mark that the font has been applied

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  // Direct paths to images in the public directory
  const heroSlides = [
    getImagePath("/images/92756_7.jpg"),
    getImagePath("/images/92578_9.jpg"),
    getImagePath("/images/912829_30.jpg"),
    getImagePath("/images/91912_3.jpg"),
    getImagePath("/images/92278_9.jpg"),
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 6000)
    return () => clearInterval(reviewInterval)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedImage])

  const galleryImages = [
    {
      src: getImagePath("/images/room1.jpg"),
      alt: "Luxury bedroom with tufted headboard and elegant decor",
      caption: "Luxury Suite Bedroom",
    },
    {
      src: getImagePath("/images/room2.jpg"),
      alt: "Close-up of premium room details and door handle",
      caption: "Premium Room Details",
    },
    {
      src: getImagePath("/images/room3.jpg"),
      alt: "Spacious suite with bench at foot of bed",
      caption: "Executive Suite",
    },
    {
      src: getImagePath("/images/room4.jpg"),
      alt: "Elegant standard room with modern furnishings",
      caption: "Deluxe Double Room",
    },
    {
      src: getImagePath("/images/room5.jpg"),
      alt: "Cozy room with wooden ceiling beams",
      caption: "Rustic Comfort Suite",
    },
    {
      src: getImagePath("/images/room6.jpg"),
      alt: "Stylish vanity area with round mirror and plants",
      caption: "Room Amenities",
    },
  ]

  const reviews = [
    {
      id: 1,
      name: "Emily Johnson",
      location: "New York, USA",
      rating: 5,
      text: "Our stay at The Pearl was absolutely magical. The attention to detail in every aspect of service was impeccable. From the moment we arrived, the staff made us feel like royalty. The room was spacious, immaculately clean, and the views were breathtaking. We'll definitely be returning!",
      image: "/images/user1.jpg",
      date: "March 15, 2023",
      type: "Honeymoon Stay",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      rating: 5,
      text: "As a frequent business traveler, I've stayed in many luxury hotels around the world, but The Pearl stands out for its exceptional service and attention to detail. The staff anticipated my needs before I even had to ask. The business facilities were top-notch, and the room was the perfect sanctuary after long meetings.",
      image: "/images/user2.jpg",
      date: "January 22, 2023",
      type: "Business Trip",
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      text: "We celebrated our anniversary at The Pearl and it exceeded all expectations. The staff arranged a special dinner on our balcony with candles and flowers. The spa treatments were divine and the room was pure luxury. Every detail was perfect - from the Egyptian cotton sheets to the handmade chocolates at turndown.",
      image: "/images/user3.jpg",
      date: "February 8, 2023",
      type: "Anniversary Celebration",
    },
    {
      id: 4,
      name: "James Wilson",
      location: "London, UK",
      rating: 5,
      text: "The culinary experience at The Pearl is worth the stay alone. The in-house restaurant serves some of the finest cuisine I've ever tasted. The chef's tasting menu with wine pairings was exceptional. Beyond the food, the rooms are spacious and elegant, and the staff is attentive without being intrusive.",
      image: "/images/user4.jpg",
      date: "April 3, 2023",
      type: "Culinary Getaway",
    },
  ]

  return (
    <>
      <div
        className={`min-h-screen bg-white ${montserrat.className} w-full`}
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        <div className="w-full m-0 p-0">
          {/* Full-Page Video/Slider Hero Section */}
          <section className="relative h-screen w-full overflow-hidden">
            {!videoEnded ? (
              /* Video Player */
              <div className="absolute inset-0 bg-black z-10">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  onEnded={() => setVideoEnded(true)}
                  playsInline
                >
                  <source src={getImagePath("/images/herovdo.mp4")} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Skip button */}
                <button
                  onClick={() => setVideoEnded(true)}
                  className="absolute bottom-10 right-10 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full z-20 transition-colors"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Skip Intro
                </button>
              </div>
            ) : (
              /* Hero Slider */
              <div className="absolute inset-0 z-10">
                <HeroSlider slides={heroSlides} />
              </div>
            )}

            {/* Content - shown over both video and slider */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20">
              <div className="max-w-3xl">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-[1px] w-12 bg-gray-300"></div>
                  <span
                    className="text-gray-300 uppercase text-sm tracking-wider"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    WELCOME TO THE PEARL
                  </span>
                  <div className="h-[1px] w-12 bg-gray-300"></div>
                </div>

                <h1 className="text-5xl md:text-7xl font-medium mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
                  Experience True Luxury
                </h1>

                <p
                  className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Indulge in the epitome of elegance and comfort at our premium hotel. Where every moment becomes a
                  cherished memory.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/rooms"
                    className="bg-[#b18c57] text-white px-8 py-4 rounded-full hover:bg-[#9a7848] transition-colors text-lg"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    BOOK YOUR STAY
                  </Link>
                  <Link
                    href="/about"
                    className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition-colors text-lg"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    DISCOVER MORE
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Add padding between hero and HotelAbout */}
          <div className="pt-28 md:pt-16 lg:pt-20"></div>

          <HotelAbout />

          {/* Add spacing after HotelAbout */}
          <div className="pt-10 md:pt-6"></div>

          {/* Featured Luxury Suite Section */}
          <section className="bg-white w-full pt-20">
            {/* Heading Section */}
            <div className="text-center pb-16 bg-white">
              <h1
                className="text-4xl md:text-5xl font-medium text-gray-800 mb-4"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                ROOMS AND SUITES
              </h1>
              <div className="w-20 h-1 bg-[#e9a8a1] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 w-full">
              {/* Left Image */}
              <div className="relative h-[400px] md:h-auto">
                <Image
                  src={`${getImagePath("/images/ROS08849_50_51.jpg")}`}
                  alt="Luxury Suite View 1"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Center Content */}
              <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center">
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>

                <h2 className="text-4xl md:text-5xl font-medium mb-8" style={{ fontFamily: "var(--font-montserrat)" }}>
                  <span className="block">Deluxe Room</span>
                </h2>

                <p className="text-justify mb-8" style={{ fontFamily: "var(--font-montserrat)" }}>
                  Our Deluxe Rooms offer an elevated stay experience with spacious interiors, elegant décor, and modern
                  amenities designed for ultimate comfort. Whether you're visiting for business or leisure, these rooms
                  provide a perfect blend of luxury and affordability.
                </p>
                <Link
                  href="/rooms"
                  className="border border-gray-300 rounded-full text-sm px-8 py-3 bg-transparent hover:bg-[#DAA520] hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  DETAILS
                </Link>
              </div>

              {/* Right Image */}
              <div className="relative h-[400px] md:h-auto">
                <Image
                  src={`${getImagePath("/images/ROS08981_2_3.jpg")}`}
                  alt="Luxury Suite View 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Room Comparison Section */}
          <section className="bg-gray-50 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 w-full">
              {/* Left Content - Deluxe Room */}
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <div className="flex mb-6 justify-center">
                  {[1, 2, 3].map((star) => (
                    <span key={star} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <h2 className="text-4xl md:text-5xl font-medium mb-8" style={{ fontFamily: "var(--font-montserrat)" }}>
                  <span className="block">Superior</span>
                  <span className="block">Double Room</span>
                </h2>

                <p className="mb-12 text-justify" style={{ fontFamily: "var(--font-montserrat)" }}>
                  The Superior Double Room at The Pearl Hotel offers a perfect mix of comfort, elegance, and
                  convenience. Designed for both leisure and business travelers, this room provides a spacious and
                  serene retreat in the heart of New Delhi.
                </p>

                <div className="mt-auto flex justify-start">
                  <Link
                    href="/rooms"
                    className="border border-gray-300 rounded-full text-sm px-8 py-3 bg-transparent hover:bg-[#DAA520] hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    DETAILS
                  </Link>
                </div>
              </div>

              {/* Center Image */}
              <div className="relative h-[400px] md:h-auto">
                <Image
                  src={`${getImagePath("/images/ROS08987_8_9.jpg")}`}
                  alt="Hotel Room Interior"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Content - Standard Room */}
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <div className="flex mb-6 justify-center">
                  {[1, 2, 3, 4].map((star) => (
                    <span key={star} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <h2 className="text-4xl md:text-5xl font-medium mb-8" style={{ fontFamily: "var(--font-montserrat)" }}>
                  <span className="block">Superior</span>
                  <span className="block">Triple Room</span>
                </h2>

                <p className="mb-12 text-justify" style={{ fontFamily: "var(--font-montserrat)" }}>
                  The Superior Triple Room at The Pearl Hotel is designed for families, friends, or small groups seeking
                  a spacious and comfortable stay. Offering modern amenities, stylish interiors, and ample space, this
                  room ensures a luxurious yet affordable experience in New Delhi.
                </p>

                <div className="mt-auto flex justify-start">
                  <Link
                    href="/rooms"
                    className="border border-gray-300 rounded-full text-sm px-8 py-3 bg-transparent hover:bg-[#DAA520] hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    DETAILS
                  </Link>
                </div>
              </div>
            </div>

            {/* Scroll to top button */}
            <div className="flex justify-end mt-8 mr-8">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-black rounded-full p-3 text-white hover:bg-gray-800 transition-colors"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </section>

          {/* Amenities Icons Section */}
          {/* Heading */}
          <div className="pt-16">
            <h2
              className="text-3xl font-medium font-bold text-center mb-8 w-full"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Our Premium Amenities
            </h2>
          </div>
          <section
            className="py-20 w-full"
            style={{
              backgroundImage: `url('${getImagePath("/images/ROS08969_70_71.jpg")}')`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4 md:px-8 lg:px-12">
                {/* Transportation */}
                <div className="bg-white p-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-[#b18c57]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                      <path d="M32,10a8,8,0,1,0-8-8A8,8,0,0,0,32,10Zm0-12a4,4,0,1,1-4,4A4,4,0,0,1,32,2Z" />
                      <path d="M54,30H52V22a6,6,0,0,0-6-6H18a6,6,0,0,0-6,6v8H10a2,2,0,0,0-2-2v8a2,2,0,0,0,2,2h2v6a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V44H44v4a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V42h2a2,2,0,0,0,2-2V32A2,2,0,0,0,54,30ZM16,22a2,2,0,0,1,2-2H46a2,2,0,0,1,2,2v8H16ZM16,48H14V42h2Zm32,0H46V42h2Zm4-8H12V34H52Z" />
                      <circle cx="20" cy="38" r="2" />
                      <circle cx="44" cy="38" r="2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800" style={{ fontFamily: "var(--font-montserrat)" }}>
                    Transportations
                  </h3>
                </div>

                {/* SPA & GYM */}
                <div className="bg-white p-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-[#b18c57]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                      <path d="M32,2C23.4,2,16.5,8.9,16.5,17.5c0,4.4,1.8,8.4,4.7,11.3c1.5,1.5,3.2,2.7,5.2,3.5c1.8,0.7,3.7,1.1,5.6,1.1 s3.9-0.4,5.6-1.1c2-0.8,3.7-2,5.2-3.5c2.9-2.9,4.7-6.9,4.7-11.3C47.5,8.9,40.6,2,32,2z M41.3,27.4c-1.3,1.3-2.8,2.3-4.5,3 c-1.5,0.6-3.2,0.9-4.8,0.9s-3.3-0.3-4.8-0.9c-1.7-0.7-3.2-1.7-4.5-3c-2.5-2.5-4-5.9-4-9.9C18.5,10,24.5,4,32,4s13.5,6,13.5,13.5 C45.5,21.5,43.9,24.9,41.3,27.4z" />
                      <path d="M32,8c-5.2,0-9.5,4.3-9.5,9.5c0,5.2,4.3,9.5,9.5,9.5s9.5-4.3,9.5-9.5C41.5,12.3,37.2,8,32,8z M32,25 c-4.1,0-7.5-3.4-7.5-7.5c0-4.1,3.4-7.5,7.5-7.5s7.5,3.4,7.5,7.5C39.5,21.6,36.1,25,32,25z" />
                      <path d="M50,36H14c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h36c1.1,0,2-0.9,2-2v-6C52,36.9,51.1,36,50,36z M48,42H16v-2h32V42z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800" style={{ fontFamily: "var(--font-montserrat)" }}>
                    SPA & GYM
                  </h3>
                </div>

                {/* Fast Wifi */}
                <div className="bg-white p-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-[#b18c57]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                      <path d="M54,36H10c-1.1,0-2,0.9-2,2v16c0,1.1,0.9,2,2,2h44c1.1,0,2-0.9,2-2V38C56,36.9,55.1,36,54,36z M52,52H12V40h40V52z" />
                      <path d="M32,44c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S33.1,44,32,44z" />
                      <path d="M40,44c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S41.1,44,40,44z" />
                      <path d="M24,44c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S25.1,44,24,44z" />
                      <path d="M32,8c-8.8,0-16,7.2-16,16h4c0-6.6,5.4-12,12-12s12,5.4,12,12h4C48,15.2,40.8,8,32,8z" />
                      <path d="M32,16c-4.4,0-8,3.6-8,8h4c0-2.2,1.8-4,4-4s4,1.8,4,4h4C40,19.6,36.4,16,32,16z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Fast Wifi</h3>
                </div>

                {/* Food & Drink */}
                <div className="bg-white p-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-[#b18c57]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                      <path d="M42,8c-1.1,0-2,0.9-2,2v4c0,5.5-4.5,10-10,10s-10-4.5-10-10v-4c0-1.1-0.9-2-2-2s-2,0.9-2,2v4c0,7.7,6.3,14,14,14 s14-6.3,14-14v-4C44,8.9,43.1,8,42,8z" />
                      <path d="M26,8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2s2-0.9,2-2V10C28,8.9,27.1,8,26,8z" />
                      <path d="M34,8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2s2-0.9,2-2V10C36,8.9,35.1,8,34,8z" />
                      <path
                        d="M46,36H18c-1.1,0-2,0.9-2,2v16c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2V38C48,36.9,47.1,36,46
</cut_off_point>
z M44,52H20V40h24V52z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800" style={{ fontFamily: "var(--font-montserrat)" }}>
                    Food & Drink
                  </h3>
                </div>

                {/* Bathtub */}
                <div className="bg-white p-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-[#b18c57]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                      <path d="M54,28H10c-1.1,0-2,0.9-2,2v4c0,1.1,0.9,2,2,2h44c1.1,0,2-0.9,2-2v-4C56,28.9,55.1,28,54,28z M52,32H12v-2h40V32z" />
                      <path d="M50,38H14c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h36c1.1,0,2-0.9,2-2V40C52,38.9,51.1,38,50,38z M48,50H16V42h32V50z" />
                      <path d="M18,54c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S19.1,54,18,54z" />
                      <path d="M46,54c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S47.1,54,46,54z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800" style={{ fontFamily: "var(--font-montserrat)" }}>
                    Bathtub
                  </h3>
                </div>

                {/* Swimming-pool */}
                <div className="bg-white p-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-[#b18c57]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                      <path
                        d="M54,36H10c-1.1,0-2,0.9-2,2v8c0,1.1,0.9,2,2,2h44c1.1,0,2-0.9,2-2v-8C56,36.
9,55.1,36,54,36z M52,44H12v-4h40V44z"
                      />
                      <path d="M14,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S15.1,32,14,32z" />
                      <path d="M22,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S23.1,32,22,32z" />
                      <path d="M30,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S31.1,32,30,32z" />
                      <path d="M38,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S39.1,32,38,32z" />
                      <path d="M46,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S47.1,32,46,32z" />
                      <path d="M50,16c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2s2-0.9,2-2v-6C52,16.9,51.1,16,50,16z" />
                      <path d="M42,16c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2s2-0.9,2-2v-6C44,16.9,43.1,16,42,16z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800" style={{ fontFamily: "var(--font-montserrat)" }}>
                    Swimming-pool
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* Destinations Section */}
          <section className="bg-white w-full">
            <div className="w-full">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-medium text-[#4a4a4a] mb-6"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Tour Package
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat)" }}>
                  Discover breathtaking destinations and unforgettable experiences around our hotel. Our concierge can
                  arrange exclusive tours and activities for you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 px-0">
                {/* First Row */}
                <div className="relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                  <Image
                    src={getImagePath("/images/delhi-tour.jpg") || "/placeholder.svg"}
                    alt="Delhi Tour"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  <div
                    className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    4 TOURS
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <h3
                      className="text-xl md:text-2xl font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      DELHI TOUR
                    </h3>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                  <Image
                    src={getImagePath("/images/rajasthan-tour.jpg") || "/placeholder.svg"}
                    alt="Rajasthan Tour"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  <div
                    className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    6 TOURS
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <p
                      className="text-[#ff6b52] italic font-medium mb-1"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      Wildlife
                    </p>
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      RAJASTHAN TOUR
                    </h3>
                  </div>
                </div>

                <div className="relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                  <Image
                    src={getImagePath("/images/caption.jpg") || "/placeholder.svg"}
                    alt="Udaypur Tour"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  <div
                    className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    3 TOURS
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <h3
                      className="text-xl md:text-2xl font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      UDAYPUR TOUR
                    </h3>
                  </div>
                </div>

                {/* Second Row */}
                <div className="col-span-1 md:col-span-2 relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                  <Image
                    src={getImagePath("/images/golden-triangle.jpg") || "/placeholder.svg"}
                    alt="Golden Triangle Tour"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  <div
                    className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    3 TOURS
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      GOLDEN TRIANGLE TOUR
                    </h3>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                  <Image
                    src={getImagePath("/images/vanarasi.jpg") || "/placeholder.svg"}
                    alt="Varanasi Tour"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  <div
                    className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    3 TOURS
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      VARANASI TOUR
                    </h3>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/#"
                  className="inline-block border-2 border-[#b18c57] text-[#b18c57] px-8 py-3 rounded-full hover:bg-[#DAA520] hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  VIEW ALL DESTINATIONS
                </Link>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <RoomSlider />
          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-5xl w-full max-h-[90vh]">
                <button
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(null)
                  }}
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="relative w-full h-full">
                  <Image
                    src={selectedImage || getImagePath("/images/placeholder.jpg")}
                    alt="Enlarged gallery image"
                    width={1200}
                    height={800}
                    className="object-contain mx-auto max-h-[80vh] rounded-3xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          <section className="w-full">
            <div className="w-full">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-medium text-[#4a4a4a] mb-6"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Get In Touch
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat)" }}>
                  Have questions or need assistance? Our team is here to help you plan your perfect stay at The Pearl
                  Hotel.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 px-4 md:px-8 lg:px-12">
                <div>
                  <EnquiryForm />
                </div>

                <div>
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2
                      className="text-xl font-semibold mb-4 font-medium"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      Our Information
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-[#b18c57]" />
                        <div>
                          <h3 className="font-medium" style={{ fontFamily: "var(--font-montserrat)" }}>
                            Address
                          </h3>
                          <p style={{ fontFamily: "var(--font-montserrat)" }}>
                            8721/1, Desh Bandhu Gupta Road,Pahar Ganj,New Delhi-110055(INDIA)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-3 text-[#b18c57]" />
                        <div>
                          <h3 className="font-medium" style={{ fontFamily: "var(--font-montserrat)" }}>
                            Phone
                          </h3>
                          <p style={{ fontFamily: "var(--font-montserrat)" }}>+91 (11) 23633363,23634363</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-3 text-[#b18c57]" />
                        <div>
                          <h3 className="font-medium" style={{ fontFamily: "var(--font-montserrat)" }}>
                            Email
                          </h3>
                          <p style={{ fontFamily: "var(--font-montserrat)" }}>hotelthepearl55@gmail.com</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                          Connect With Us
                        </h3>
                        <div className="flex space-x-4">
                          <a
                            href="https://www.facebook.com/thehotelpearlresidency/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#b18c57]"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            <Facebook className="h-5 w-5" />
                          </a>
                          <a
                            href="https://www.instagram.com/thehotelpearlresidency/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#b18c57]"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            <Instagram className="h-5 w-5" />
                          </a>
                          <a
                            href="https://x.com/the_hotel_pearl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#b18c57]"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="rounded-lg overflow-hidden h-[300px] relative">
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <MapPinned className="w-12 h-12 text-[#b18c57]" />
                      <span className="sr-only">Map location of The Pearl Hotel</span>
                    </div>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4924854870114!2d77.21180747528953!3d28.644969075658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd679c9500a5%3A0x7a61b946bf5f7e8c!2sHotel%20The%20Pearl!5e0!3m2!1sen!2sin!4v1742744532602!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="The Pearl Hotel Location"
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

