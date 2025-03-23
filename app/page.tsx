"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ChevronUp, MapPinned } from "lucide-react"
import EnquiryForm from "@/components/enquiry-form"
import HotelAbout from "@/components/hotel-about"
import RoomSlider from "@/components/gallery"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    `${process.env.ENV_IMAGE}/images/hero1.jpg`,
    `${process.env.ENV_IMAGE}/images/hero2.jpg`,
    `${process.env.ENV_IMAGE}/images/hero3.jpg`,
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

  // Image slider interval after video ends
  useEffect(() => {
    if (videoEnded) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 5000)

      return () => clearInterval(slideInterval)
    }
  }, [videoEnded, heroSlides.length])

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
      src: `${process.env.ENV_IMAGE}/images/room1.jpg`,
      alt: "Luxury bedroom with tufted headboard and elegant decor",
      caption: "Luxury Suite Bedroom",
    },
    {
      src: `${process.env.ENV_IMAGE}/images/room2.jpg`,
      alt: "Close-up of premium room details and door handle",
      caption: "Premium Room Details",
    },
    {
      src: `${process.env.ENV_IMAGE}/images/room3.jpg`,
      alt: "Spacious suite with bench at foot of bed",
      caption: "Executive Suite",
    },
    {
      src: `${process.env.ENV_IMAGE}/images/room4.jpg`,
      alt: "Elegant standard room with modern furnishings",
      caption: "Deluxe Double Room",
    },
    {
      src: `${process.env.ENV_IMAGE}/images/room5.jpg`,
      alt: "Cozy room with wooden ceiling beams",
      caption: "Rustic Comfort Suite",
    },
    {
      src: `${process.env.ENV_IMAGE}/images/room6.jpg`,
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
      image: `${process.env.ENV_IMAGE}/images/user1.jpg`,
      date: "March 15, 2023",
      type: "Honeymoon Stay",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      rating: 5,
      text: "As a frequent business traveler, I've stayed in many luxury hotels around the world, but The Pearl stands out for its exceptional service and attention to detail. The staff anticipated my needs before I even had to ask. The business facilities were top-notch, and the room was the perfect sanctuary after long meetings.",
      image: `${process.env.ENV_IMAGE}/images/user2.jpg`,
      date: "January 22, 2023",
      type: "Business Trip",
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      text: "We celebrated our anniversary at The Pearl and it exceeded all expectations. The staff arranged a special dinner on our balcony with candles and flowers. The spa treatments were divine and the room was pure luxury. Every detail was perfect - from the Egyptian cotton sheets to the handmade chocolates at turndown.",
      image: `${process.env.ENV_IMAGE}/images/user3.jpg`,
      date: "February 8, 2023",
      type: "Anniversary Celebration",
    },
    {
      id: 4,
      name: "James Wilson",
      location: "London, UK",
      rating: 5,
      text: "The culinary experience at The Pearl is worth the stay alone. The in-house restaurant serves some of the finest cuisine I've ever tasted. The chef's tasting menu with wine pairings was exceptional. Beyond the food, the rooms are spacious and elegant, and the staff is attentive without being intrusive.",
      image: `${process.env.ENV_IMAGE}/images/user4.jpg`,
      date: "April 3, 2023",
      type: "Culinary Getaway",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1440px]">
        {/* Full-Page Video/Slider Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* Video/Image Background */}
          <div className="absolute inset-0 w-full h-full">
            {!videoEnded ? (
              <video
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onEnded={() => setVideoEnded(true)}
              >
                <source src={`${process.env.ENV_IMAGE}/images/hotel-video.mp4`} type="video/mp4" />
                {/* Fallback image if video doesn't load */}
                <Image
                  src={`${process.env.ENV_IMAGE}/images/hero1.jpg`}
                  alt="Luxex Hotel"
                  fill
                  className="object-cover"
                  priority
                />
              </video>
            ) : (
              <div className="absolute inset-0 w-full h-full">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                      currentSlide === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={slide || "/placeholder.svg"}
                      alt={`The Pearl Hotel - Slide ${index + 1}`}
                      fill
                      className={`object-cover transition-transform duration-[3000ms] ease-in-out transform will-change-transform ${
                        currentSlide === index ? "scale-110" : "scale-100"
                      }`}
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4 z-10">
            <div className="max-w-3xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-gray-300"></div>
                <span className="text-gray-300 uppercase text-sm tracking-wider">WELCOME TO THE PEARL</span>
                <div className="h-[1px] w-12 bg-gray-300"></div>
              </div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6">Experience True Luxury</h1>

              <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
                Indulge in the epitome of elegance and comfort at our premium hotel. Where every moment becomes a
                cherished memory.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/rooms"
                  className="bg-[#b18c57] text-white px-8 py-4 rounded-full hover:bg-[#9a7848] transition-colors text-lg"
                >
                  BOOK YOUR STAY
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition-colors text-lg"
                >
                  DISCOVER MORE
                </Link>
              </div>
            </div>

            {/* Slider Indicators */}
            {videoEnded && (
              <div className="absolute bottom-10 flex space-x-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentSlide === index ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Scroll Down Indicator (only show when video is playing) */}
            {!videoEnded && (
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 5v14"></path>
                  <path d="m19 12-7 7-7-7"></path>
                </svg>
              </div>
            )}
          </div>
        </section>

        {/* Hero Section with Curved Image */}
        {/* <section className="relative min-h-screen flex flex-col md:flex-row"> */}
        {/* Left Content */}
        {/* <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 z-10">
          <div className="max-w-md">
            

            <h1 className="text-4xl md:text-5xl font-serif text-[#4a4a4a] mb-6">The Pearl Hotel</h1>

            <p className="text-gray-600 mb-12">
            "Experience the best of Indian hospitality at Hotel The Pearl,
             one of the leading economy hotel in India. 
             Our boutique hotel in New Delhi offers a blend of fine living, comfort, and affordability.

            </p>

            <div className="space-y-6">
              <Link
                href="/booking"
                className="inline-flex items-center text-[#b18c57] font-medium uppercase tracking-wider text-sm hover:text-[#9a7848] transition-colors"
              >
                <span className="mr-2">MAKE A RESERVATION</span>
                <Phone className="w-4 h-4" />
              </Link>

              <div className="h-[1px] w-full bg-gray-200"></div>

              <p className="text-gray-500">
                Call us at <span className="text-[#b18c57]">+91 (11) 23633363</span>
              </p>
            </div>
          </div>
        </div> */}

        {/* Right Image with Curved Edge */}
        {/* <div className="w-full md:w-1/2 relative">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              borderTopLeftRadius: "120px",
              borderBottomLeftRadius: "120px",
            }}
          >
            <Image
              src="../images/ROS09257_8_9.jpg"
              alt="Luxex Hotel Interior"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section> */}

        {/* <section className="relative min-h-screen flex flex-col md:flex-row">
  <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 z-10 bg-white">
    <div className="max-w-md">
    <h1 className="text-5xl md:text-7xl font-black text-[#222] mb-8 leading-tight tracking-wide text-center uppercase">The Pearl</h1>

      <p className="text-gray-600 mb-6 text-justify">
        Experience the best of Indian hospitality at Hotel The Pearl, one of the leading economy hotels in India. Our boutique hotel in New Delhi offers a blend of fine living, comfort, and affordability.
      </p>

      <p className="text-gray-600 mb-6 text-justify">
        Conveniently located in City Centre, near Connaught Place, Paharganj Market, and adjacent to the New Delhi Railway Station, our hotel provides easy access to the city and beyond.
      </p>


      <div className="space-y-6">
        <Link
          href="/booking"
          className="inline-flex items-center text-[#b18c57] font-medium uppercase tracking-wider text-sm hover:text-[#9a7848] transition-colors"
        >
          <span className="mr-2">MAKE A RESERVATION</span>
          <Phone className="w-4 h-4" />
        </Link>

        <div className="h-[1px] w-full bg-gray-200"></div>

        <p className="text-gray-500">
          Call us at <span className="text-[#b18c57]">+91 (11) 23633363</span>
        </p>
      </div>
    </div>
  </div>

  <div className="w-full md:w-1/2 relative">
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        borderTopLeftRadius: "120px",
        borderBottomLeftRadius: "120px",
      }}
    >
      <Image
        src="../images/ROS09257_8_9.jpg"
        alt="Luxury Hotel Interior"
        fill
        className="object-cover"
        priority
      />
    </div>
  </div>
</section> */}

        <HotelAbout />

        {/* Featured Luxury Suite Section */}
        <section className=" bg-white">
          {/* Heading Section */}
          <div className="text-center py-16 bg-white">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">ROOMS AND SUITES</h1>
            <div className="w-20 h-1 bg-[#e9a8a1] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left Image */}
            <div className="relative h-[400px] md:h-auto">
              <Image
                src={`${process.env.ENV_IMAGE}/images/deluxe-room1.jpg`}
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

              <h2 className="text-4xl md:text-5xl font-serif mb-8">
                <span className="block">Deluxe Room</span>
              </h2>

              <p className="text-justify mb-8">
                Our Deluxe Rooms offer an elevated stay experience with spacious interiors, elegant décor, and modern
                amenities designed for ultimate comfort. Whether you're visiting for business or leisure, these rooms
                provide a perfect blend of luxury and affordability.
              </p>
              <Link
                href="/rooms"
                className="border border-gray-300 rounded-full text-sm px-8 py-3 bg-transparent hover:bg-[#DAA520] hover:text-white transition-colors"
              >
                DETAILS
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative h-[400px] md:h-auto">
              <Image
                src={`${process.env.ENV_IMAGE}/images/deluxe-room2.jpg`}
                alt="Luxury Suite View 2"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Room Comparison Section */}
        <section className=" bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left Content - Deluxe Room */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="flex mb-6 justify-center">
                {[1, 2, 3].map((star) => (
                  <span key={star} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif  mb-8">
                <span className="block">Superior</span>
                <span className="block">Double Room</span>
              </h2>

              <p className=" mb-12 text-justify">
                The Superior Double Room at The Pearl Hotel offers a perfect mix of comfort, elegance, and convenience.
                Designed for both leisure and business travelers, this room provides a spacious and serene retreat in
                the heart of New Delhi.
              </p>

              <div className="mt-auto flex justify-start">
                <Link
                  href="/rooms"
                  className="border border-gray-300 rounded-full text-sm px-8 py-3 bg-transparent hover:bg-[#DAA520] hover:text-white transition-colors"
                >
                  DETAILS
                </Link>
              </div>
            </div>

            {/* Center Image */}
            <div className="relative h-[400px] md:h-auto">
              <Image
                src={`${process.env.ENV_IMAGE}/images/superior-double.jpg`}
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
              <h2 className="text-4xl md:text-5xl font-serif  mb-8">
                <span className="block">Superior</span>
                <span className="block">Triple Room</span>
              </h2>

              <p className=" mb-12 text-justify">
                The Superior Triple Room at The Pearl Hotel is designed for families, friends, or small groups seeking a
                spacious and comfortable stay. Offering modern amenities, stylish interiors, and ample space, this room
                ensures a luxurious yet affordable experience in New Delhi.
              </p>

              <div className="mt-auto flex justify-start">
                <Link
                  href="/rooms"
                  className="border border-gray-300 rounded-full text-sm px-8 py-3 bg-transparent hover:bg-[#DAA520] hover:text-white transition-colors"
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
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Amenities Icons Section */}
        {/* Heading */}
        <h2 className="text-3xl font-serif font-bold text-center mb-8 pt-12">Our Premium Amenities</h2>
        <section
          className="py-20 "
          style={{
            backgroundImage: `url('${process.env.ENV_IMAGE}/images/amenities-bg.jpg')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <h3 className="text-lg font-serif text-gray-800">Transportations</h3>
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
                <h3 className="text-lg font-serif text-gray-800">SPA & GYM</h3>
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
                <h3 className="text-lg font-serif text-gray-800">Fast Wifi</h3>
              </div>

              {/* Food & Drink */}
              <div className="bg-white p-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 text-[#b18c57]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                    <path d="M42,8c-1.1,0-2,0.9-2,2v4c0,5.5-4.5,10-10,10s-10-4.5-10-10v-4c0-1.1-0.9-2-2-2s-2,0.9-2,2v4c0,7.7,6.3,14,14,14 s14-6.3,14-14v-4C44,8.9,43.1,8,42,8z" />
                    <path d="M26,8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2s2-0.9,2-2V10C28,8.9,27.1,8,26,8z" />
                    <path d="M34,8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2s2-0.9,2-2V10C36,8.9,35.1,8,34,8z" />
                    <path d="M46,36H18c-1.1,0-2,0.9-2,2v16c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2V38C48,36.9,47.1,36,46,36z M44,52H20V40h24V52z" />
                  </svg>
                </div>
                <h3 className="text-lg font-serif text-gray-800">Food & Drink</h3>
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
                <h3 className="text-lg font-serif text-gray-800">Bathtub</h3>
              </div>

              {/* Swimming-pool */}
              <div className="bg-white p-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 text-[#b18c57]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                    <path d="M54,36H10c-1.1,0-2,0.9-2,2v8c0,1.1,0.9,2,2,2h44c1.1,0,2-0.9,2-2v-8C56,36.9,55.1,36,54,36z M52,44H12v-4h40V44z" />
                    <path d="M14,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S15.1,32,14,32z" />
                    <path d="M22,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S23.1,32,22,32z" />
                    <path d="M30,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S31.1,32,30,32z" />
                    <path d="M38,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S39.1,32,38,32z" />
                    <path d="M46,32c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S47.1,32,46,32z" />
                    <path d="M50,16c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2s2-0.9,2-2v-6C52,16.9,51.1,16,50,16z" />
                    <path d="M42,16c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2s2-0.9,2-2v-6C44,16.9,43.1,16,42,16z" />
                  </svg>
                </div>
                <h3 className="text-lg font-serif text-gray-800">Swimming-pool</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Section */}
        <section className="pt-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">Tour Package</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover breathtaking destinations and unforgettable experiences around our hotel. Our concierge can
                arrange exclusive tours and activities for you.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {/* First Row */}
              <div className="relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                <Image
                  src={`${process.env.ENV_IMAGE}/images/delhi-tour.jpg`}
                  alt="Delhi Tour"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full">
                  4 TOURS
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white">DELHI TOUR</h3>
                </div>
              </div>

              <div className="col-span-2 relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                <Image
                  src={`${process.env.ENV_IMAGE}/images/rajasthan-tour.jpg`}
                  alt="Rajasthan Tour"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full">
                  6 TOURS
                </div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-[#ff6b52] italic font-medium mb-1">Wildlife</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">RAJASTHAN TOUR</h3>
                </div>
              </div>

              <div className="relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                <Image
                  src={`${process.env.ENV_IMAGE}/images/udaipur-tour.jpg`}
                  alt="Udaypur Tour"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full">
                  3 TOURS
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white">UDAYPUR TOUR</h3>
                </div>
              </div>

              {/* Second Row */}
              <div className="col-span-2 relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                <Image
                  src={`${process.env.ENV_IMAGE}/images/golden-triangle.jpg`}
                  alt="Golden Triangle Tour"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full">
                  3 TOURS
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">GOLDEN TRIANGLE TOUR</h3>
                </div>
              </div>

              <div className="col-span-2 relative rounded-[10px] overflow-hidden group h-[350px] shadow-md">
                <Image
                  src={`${process.env.ENV_IMAGE}/images/varanasi-tour.jpg`}
                  alt="Varanasi Tour"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute top-4 right-4 bg-[#ff6b52] text-white text-sm font-medium px-4 py-1 rounded-full">
                  3 TOURS
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">VARANASI TOUR</h3>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/#"
                className="inline-block border-2 border-[#b18c57] text-[#b18c57] px-8 py-3 rounded-full hover:bg-[#DAA520] hover:text-white transition-colors"
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
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage || `${process.env.ENV_IMAGE}/images/placeholder.jpg`}
                  alt="Enlarged gallery image"
                  width={1200}
                  height={800}
                  className="object-contain mx-auto max-h-[80vh] rounded-3xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="w-full h-[500px] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/ROS09257_8_9.jpg"
                    alt="About Luxex Hotel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-lg shadow-lg w-48 h-48 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[#b18c57]">25</span>
                  <span className="text-gray-600 text-center">Years of Excellence</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              

              <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">
                Experience Luxury Like Never Before
              </h2>

              <p className="text-gray-600 mb-6">
              Experience the best of Indian hospitality at Hotel The Pearl, one of the leading economy hotels in India. Our boutique hotel in New Delhi offers a blend of fine living, comfort, and affordability.


              </p>

              <p className="text-gray-600 mb-8">
              Conveniently located in City Centre, near Connaught Place, Paharganj Market, 
              and adjacent to the New Delhi Railway Station, our hotel provides easy access to the city and beyond.
              </p>
              <p className="text-gray-600 mb-8">
              At Hotel The Pearl, we strive to deliver exceptional quality
               and services at an affordable price. Our range of facilities and services includes:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#b18c57] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span>01</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Luxury Rooms</h3>
                    <p className="text-gray-600 text-sm">
                      Spacious and elegantly designed rooms with premium amenities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#b18c57] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span>02</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Fine Dining</h3>
                    <p className="text-gray-600 text-sm">Exquisite culinary experiences with world-class chefs.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#b18c57] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span>03</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Premium Spa</h3>
                    <p className="text-gray-600 text-sm">
                      Rejuvenate your body and mind with our premium spa services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#b18c57] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span>04</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">24/7 Service</h3>
                    <p className="text-gray-600 text-sm">Round-the-clock service to cater to all your needs.</p>
                  </div>
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
      </section> */}

        {/* Customer Reviews Section */}
        {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
           

            <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">What Our Guests Say</h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what makes our hotel special through the eyes of our valued guests. Their experiences speak
              volumes about our commitment to excellence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-[#b18c57] opacity-20">
              <Quote className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`transition-opacity duration-700 ${activeReviewIndex === index ? "opacity-100" : "opacity-0 absolute inset-0"}`}
                >
                  <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                      <div className="flex-shrink-0">
                        <Image
                          src={review.image || "/placeholder.svg"}
                          alt={review.name}
                          width={80}
                          height={80}
                          className="rounded-full border-4 border-[#b18c57]"
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold mr-3">{review.name}</h3>
                          <span className="text-sm text-gray-500">{review.location}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-[#b18c57] italic">{review.type}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic text-lg leading-relaxed mb-4">"{review.text}"</p>
                    <p className="text-right text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full mx-1 transition-colors ${activeReviewIndex === idx ? "bg-[#b18c57]" : "bg-gray-300"}`}
                  onClick={() => setActiveReviewIndex(idx)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section> */}

        {/* Contact Section */}
        <section className="pt-20 ">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">Get In Touch</h2>

              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions or need assistance? Our team is here to help you plan your perfect stay at Luxex Hotel.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <EnquiryForm />
              </div>

              <div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4 font-serif">Our Information</h2>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-[#b18c57]" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p>8721/1, Desh Bandhu Gupta Road,Pahar Ganj,New Delhi-110055(INDIA)</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-[#b18c57]" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p>+91 (11) 23633363,23634363</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-[#b18c57]" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p>hotelthepearl55@gmail.com</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Connect With Us</h3>
                      <div className="flex space-x-4">
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#b18c57]"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#b18c57]"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#b18c57]"
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26430.393553120906!2d-118.43209796322542!3d34.08346478815366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1648242349207!5m2!1sen!2sus"
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
  )
}

