"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, ArrowRight, CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  return (
    <div className="min-h-screen bg-white">
      {/* Page Title Section */}
      <section
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">About Us</h1>
          <div className="flex items-center text-white">
            <Link href="/" className="hover:text-[#b18c57]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#b18c57]">About</span>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="w-full h-[500px] relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                    alt="Luxex Hotel History"
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
              <div className="flex items-center gap-4 mb-6"></div>

              <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">A Legacy of Luxury Since 2002</h2>

              <p className="text-gray-600 mb-6">
                Experience the best of Indian hospitality at Hotel The Pearl, one of the leading economy hotels in
                India. Our boutique hotel in New Delhi offers a blend of fine living, comfort, and affordability.
                Conveniently located in City Centre, near Connaught Place, Paharganj Market, and adjacent to the New
                Delhi Railway Station, our hotel provides easy access to the city and beyond.
              </p>

              <p className="text-gray-600 mb-8">
                At Hotel The Pearl, we strive to deliver exceptional quality and services at an affordable price. Our
                range of facilities and services includes:
              </p>
              <ul>
                <li>🌟 Elaborate range of services and facilities</li>
                <li>🌟 Affordable tour packages</li>
                <li>🌟 On-site restaurant</li>
                <li>🌟 Budget-friendly accommodation</li>
                <li>🌟 Gym</li>
                <li>🌟 Conference Facility</li>
                <li>🌟 Beautiful Rooftop to relax</li>
              </ul>

              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-6">
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                    alt="Jonathan Dawson"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="italic text-gray-600 mb-2">
                    "Our mission has always been to create not just a place to stay, but a destination that becomes part
                    of our guests' most cherished memories."
                  </p>
                  <p className="font-bold">Jonathan Dawson</p>
                  <p className="text-sm text-gray-500">Founder & CEO</p>
                </div>
              </div>

              <Link
                href="/#"
                className="inline-flex items-center text-[#b18c57] font-medium uppercase tracking-wider text-sm hover:text-[#9a7848] transition-colors"
              >
                <span className="mr-2">EXPLORE OUR GALLERY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">The Principles That Guide Us</h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              At The Pearl, our core values shape every aspect of our service and operations. These principles have
              guided us for over two decades and continue to define the exceptional experience we provide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#b18c57]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#b18c57]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Personalized Service</h3>
              <p className="text-gray-600">
                We believe that true luxury lies in personalization. Every guest is unique, and we tailor our service to
                meet individual preferences and exceed expectations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#b18c57]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#b18c57]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Unwavering Quality</h3>
              <p className="text-gray-600">
                From our meticulously designed interiors to our carefully curated amenities, we maintain the highest
                standards in every detail of the Luxex experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#b18c57]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#b18c57]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Cultural Connection</h3>
              <p className="text-gray-600">
                We embrace the unique culture and heritage of each location, creating authentic experiences that connect
                our guests with the destination's essence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#b18c57]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#b18c57]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v19"></path>
                  <path d="M5 8l7-5 7 5"></path>
                  <path d="M5 16l7 5 7-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600">
                While honoring tradition, we continuously evolve and innovate to enhance the guest experience, embracing
                new technologies and hospitality trends.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#b18c57]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#b18c57]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Culinary Excellence</h3>
              <p className="text-gray-600">
                We believe that exceptional dining is integral to the luxury experience, offering world-class cuisine
                that celebrates both local flavors and international gastronomy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#b18c57]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#b18c57]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We are committed to responsible luxury, implementing sustainable practices that minimize our
                environmental footprint while enhancing the guest experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">Meet Our Leadership</h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Our exceptional team brings decades of combined experience in luxury hospitality. Their passion and
              expertise drive our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Jonathan Dawson",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
                bio: "With over 30 years in luxury hospitality, Jonathan founded Luxex with a vision to create the world's most refined hotel experience.",
              },
              {
                name: "Sophia Chen",
                role: "Chief Operating Officer",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
                bio: "Sophia oversees all operational aspects of Luxex properties worldwide, ensuring consistent excellence across our portfolio.",
              },
              {
                name: "Marcus Williams",
                role: "Executive Chef",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
                bio: "A Michelin-starred chef, Marcus leads our culinary program, creating innovative dining experiences that celebrate global flavors.",
              },
              {
                name: "Isabella Rodriguez",
                role: "Director of Guest Experience",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
                bio: "Isabella's expertise in personalized service ensures that every guest enjoys a memorable and tailored Luxex experience.",
              },
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={member.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex justify-center space-x-4">
                        <a href="#" className="text-white hover:text-[#b18c57]">
                          <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-white hover:text-[#b18c57]">
                          <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-white hover:text-[#b18c57]">
                          <Instagram className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-[#b18c57] mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/#"
              className="inline-block border-2 border-[#b18c57] text-[#b18c57] px-8 py-3 rounded-full hover:bg-[#b18c57] hover:text-white transition-colors"
            >
              MEET THE FULL TEAM
            </Link>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">Recognition & Awards</h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by the most prestigious organizations in the hospitality
              industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                  alt="Five Star Award"
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Five Star Award</h3>
              <p className="text-gray-600 mb-4">Forbes Travel Guide</p>
              <p className="text-sm text-gray-500">Consecutively awarded since 2010</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                  alt="Best Luxury Hotel"
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Luxury Hotel</h3>
              <p className="text-gray-600 mb-4">World Travel Awards</p>
              <p className="text-sm text-gray-500">2018, 2020, 2022</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                  alt="Michelin Star"
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Michelin Star</h3>
              <p className="text-gray-600 mb-4">Michelin Guide</p>
              <p className="text-sm text-gray-500">Awarded to our signature restaurant</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                  alt="Sustainability Excellence"
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainability Excellence</h3>
              <p className="text-gray-600 mb-4">Green Hospitality Awards</p>
              <p className="text-sm text-gray-500">For our eco-friendly initiatives</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-[#4a4a4a] mb-6">The Pearl Difference</h2>

              <p className="text-gray-600 mb-8">
                What sets The Pearl apart is our unwavering commitment to creating extraordinary experiences. We believe
                that true luxury is found in the perfect balance of impeccable service, elegant surroundings, and
                thoughtful attention to every detail.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="mr-4 text-[#b18c57]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Unparalleled Location</h3>
                    <p className="text-gray-600">
                      Situated in the heart of the city, offering convenient access to major attractions while providing
                      a serene retreat from the urban bustle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 text-[#b18c57]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Bespoke Experiences</h3>
                    <p className="text-gray-600">
                      Our dedicated concierge team crafts personalized experiences tailored to your preferences, from
                      private tours to exclusive dining arrangements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 text-[#b18c57]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Exceptional Amenities</h3>
                    <p className="text-gray-600">
                      From our world-class spa to our state-of-the-art fitness center and infinity pool, every amenity
                      is designed to enhance your stay.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/rooms"
                className="inline-block bg-[#b18c57] text-white px-8 py-3 rounded-full hover:bg-[#9a7848] transition-colors"
              >
                BOOK YOUR STAY
              </Link>
            </div>

            <div className="w-full md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-[200px] relative rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                      alt="Luxex Spa"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-[250px] relative rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                      alt="Luxex Restaurant"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-[250px] relative rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                      alt="Luxex Pool"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-[200px] relative rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                      alt="Luxex Concierge"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Experience the Epitome of Luxury</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join us at Luxex Hotel and discover why discerning travelers from around the world choose us for their most
            memorable stays.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/rooms"
              className="bg-[#b18c57] text-white px-8 py-3 rounded-full hover:bg-[#9a7848] transition-colors"
            >
              BOOK YOUR STAY
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

