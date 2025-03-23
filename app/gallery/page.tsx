import type { Metadata } from "next"
import Image from "next/image"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GalleryCard } from "@/components/gallery-card"

export const metadata: Metadata = {
  title: "Gallery | The Pearl Hotel",
  description: "Explore our beautiful hotel through our gallery of images and videos.",
}

export default function GalleryPage() {
  // Gallery categories
  const categories = [
    { id: "all", label: "All" },
    { id: "rooms", label: "Rooms & Suites" },
    { id: "dining", label: "Dining" },
    { id: "amenities", label: "Amenities" },
    { id: "events", label: "Events" },
  ]

  // Gallery images
  const baseUrl = process.env.ENV_IMAGE;

  const galleryImages = [
    {
      id: 1,
      src: `${baseUrl}/images/ROS08996_7_8.jpg`,
      alt: "Luxury Suite",
      title: "Luxury Suite",
      description: "Our spacious luxury suite with king-size bed and panoramic views.",
      category: "rooms",
    },
    {
      id: 2,
      src: `${baseUrl}/images/ROS08972_3_4.jpg`,
      alt: "Deluxe Room",
      title: "Deluxe Room",
      description: "Elegant deluxe room with modern amenities and comfortable furnishings.",
      category: "rooms",
    },
    {
      id: 3,
      src: `${baseUrl}/images/ROS08981_2_3.jpg`,
      alt: "Premium Suite",
      title: "Premium Suite",
      description: "Premium suite featuring a separate living area and luxurious bathroom.",
      category: "rooms",
    },
    {
      id: 4,
      src: `${baseUrl}/images/ROS08915_6_7.jpg`,
      alt: "Executive Room",
      title: "Executive Room",
      description: "Sophisticated executive room designed for both comfort and productivity.",
      category: "rooms",
    },
    {
      id: 5,
      src: `${baseUrl}/images/ROS08921_2_3.jpg`,
      alt: "Main Restaurant",
      title: "The Pearl Restaurant",
      description: "Our elegant main restaurant serving international cuisine with a local twist.",
      category: "dining",
    },
    {
      id: 6,
      src: `${baseUrl}/images/ROS08957_8_9.jpg`,
      alt: "Hotel Bar",
      title: "Skyline Bar",
      description: "Sophisticated bar offering craft cocktails and panoramic city views.",
      category: "dining",
    },
    {
      id: 7,
      src: `${baseUrl}/images/ROS09164_5_6.jpg`,
      alt: "Swimming Pool",
      title: "Infinity Pool",
      description: "Our stunning infinity pool overlooking the city skyline.",
      category: "amenities",
    },
    {
      id: 8,
      src: `${baseUrl}/images/ROS08894_5_6.jpg`,
      alt: "Spa Treatment Room",
      title: "Serenity Spa",
      description: "Luxurious spa treatment room for ultimate relaxation and rejuvenation.",
      category: "amenities",
    },
    {
      id: 9,
      src: `${baseUrl}/images/ROS08831_2_3.jpg`,
      alt: "Fitness Center",
      title: "Fitness Center",
      description: "State-of-the-art fitness center with the latest equipment.",
      category: "amenities",
    },
    {
      id: 10,
      src: `${baseUrl}/images/ROS08807_8_9.jpg`,
      alt: "Conference Room",
      title: "Grand Ballroom",
      description: "Elegant venue for conferences, weddings, and special events.",
      category: "events",
    },
    {
      id: 11,
      src: `${baseUrl}/images/ROS08750_1_2.jpg`,
      alt: "Wedding Setup",
      title: "Wedding Venue",
      description: "Beautiful setup for a dream wedding ceremony and reception.",
      category: "events",
    },
    {
      id: 12,
      src: `${baseUrl}/images/ROS08732_3_4.jpg`,
      alt: "Delhi Tour",
      title: "Delhi Exploration",
      description: "Discover the rich history and vibrant culture of Delhi.",
      category: "events",
    },
  ];
  

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our beautiful hotel through our collection of images. Get a glimpse of our luxurious rooms, exquisite
          dining options, state-of-the-art amenities, and elegant event spaces.
        </p>
      </div>

      {/* Featured Video Section */}
      <div className="mb-16">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={`${baseUrl}/images/ROS08732_3_4.jpg`}
          alt="Hotel Video Thumbnail"
          fill
          className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button size="lg" className="rounded-full h-16 w-16 flex items-center justify-center">
              <Play className="h-8 w-8" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h2 className="text-2xl font-bold mb-2">Experience The Pearl Hotel</h2>
            <p className="text-white/80">Take a virtual tour of our luxurious hotel and amenities</p>
          </div>
        </div>
      </div>

      {/* Gallery Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <GalleryCard key={image.id} image={image} images={galleryImages} />
            ))}
          </div>
        </TabsContent>

        {categories.slice(1).map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages
                .filter((image) => image.category === category.id)
                .map((image) => (
                  <GalleryCard
                    key={image.id}
                    image={image}
                    images={galleryImages.filter((img) => img.category === category.id)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

