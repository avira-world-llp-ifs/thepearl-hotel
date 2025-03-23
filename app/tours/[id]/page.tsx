import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Clock, MapPin, Users } from "lucide-react"
import TourBookingForm from "@/components/tour-booking-form"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Compass, Utensils, Bed, Bus, Star } from "lucide-react"

interface TourDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  try {
    const tour = await getTour(params.id)

    if (!tour) {
      return {
        title: "Tour Not Found",
        description: "The requested tour could not be found.",
      }
    }

    return {
      title: `${tour.name} | Tours`,
      description: tour.description.substring(0, 160),
    }
  } catch (error) {
    return {
      title: "Tour Details",
      description: "View tour details and book your next adventure.",
    }
  }
}

async function getTour(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch tour")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching tour:", error)
    return null
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const tour = await getTour(params.id)

  if (!tour) {
    notFound()
  }

  // Prepare tour data with defaults if needed
  const tourData = {
    title: tour.name || tour.title || "Tour Package",
    description: tour.description || "Experience an amazing journey with our carefully curated tour package.",
    image: tour.image || "/placeholder.svg?height=400&width=800",
    duration: tour.duration || "N/A",
    location: tour.location || "Various Locations",
    price: tour.price || 0,
    startDate: tour.startDate || tour.startDates?.[0] || new Date().toISOString(),
    maxGroupSize: tour.maxGroupSize || 15,
    difficulty: tour.difficulty || "Easy",
    highlights: tour.highlights || [
      "Guided tours of major attractions",
      "Comfortable accommodation",
      "Transportation included",
      "Experienced tour guides",
    ],
    inclusions: tour.inclusions || tour.included || ["Accommodation", "Transportation", "Tour guide", "Entrance fees"],
    exclusions: tour.exclusions || [
      "International flights",
      "Personal expenses",
      "Travel insurance",
      "Optional activities",
    ],
    itinerary: tour.itinerary || [
      {
        day: 1,
        title: "Arrival Day",
        description: "Arrive at the destination and check into your accommodation. Welcome meeting in the evening.",
      },
      {
        day: 2,
        title: "Exploration Day",
        description: "Full day guided tour of major attractions.",
      },
      {
        day: tour.duration ? Number.parseInt(tour.duration) : 3,
        title: "Departure Day",
        description: "Check out from accommodation and departure.",
      },
    ],
    meals: tour.meals || "Selected meals included",
    accommodation: tour.accommodation || "Comfortable hotels",
    transportation: tour.transportation || "Air-conditioned vehicles",
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tour Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
            <Image src={tourData.image || "/placeholder.svg"} alt={tourData.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tourData.title}</h1>
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{tourData.duration} days</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{tourData.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Max {tourData.maxGroupSize} people</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full bg-slate-50 p-0 h-14 rounded-lg">
              <TabsTrigger
                value="overview"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:shadow-none rounded-lg"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:shadow-none rounded-lg"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger
                value="inclusions"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:shadow-none rounded-lg"
              >
                Inclusions
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:shadow-none rounded-lg"
              >
                Gallery
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
                <p className="text-gray-600 dark:text-gray-300">{tourData.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border rounded-lg overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Compass className="h-5 w-5 mr-2 text-primary" />
                      Tour Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{tourData.duration} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{tourData.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Group Size:</span>
                        <span className="font-medium">Max {tourData.maxGroupSize} people</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Start Date:</span>
                        <span className="font-medium">{formatDate(tourData.startDate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Difficulty:</span>
                        <span className="font-medium capitalize">{tourData.difficulty}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border rounded-lg overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-primary" />
                      Highlights
                    </h3>
                    <ul className="space-y-2">
                      {tourData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border rounded-lg overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <Utensils className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold text-lg">Meals</h3>
                    <p className="text-sm text-gray-500">{tourData.meals}</p>
                  </CardContent>
                </Card>

                <Card className="border rounded-lg overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold text-lg">Accommodation</h3>
                    <p className="text-sm text-gray-500">{tourData.accommodation}</p>
                  </CardContent>
                </Card>

                <Card className="border rounded-lg overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <Bus className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold text-lg">Transportation</h3>
                    <p className="text-sm text-gray-500">{tourData.transportation}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="mt-6 space-y-6">
              <h2 className="text-2xl font-bold mb-4">Tour Itinerary</h2>
              <div className="space-y-8">
                {tourData.itinerary.map((day, index) => (
                  <div key={index} className="border-l-2 border-primary pl-6 pb-6 relative">
                    <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
                    <h3 className="text-xl font-semibold">
                      Day {day.day || index + 1}: {day.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{day.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Inclusions Tab */}
            <TabsContent value="inclusions" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {tourData.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="text-red-500 mr-2">×</span>
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {tourData.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-0.5 flex-shrink-0">×</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Tour Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(tour.images || [tourData.image]).map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg?height=200&width=300"}
                      alt={`${tourData.title} - Image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}

                {(!tour.images || tour.images.length < 2) && (
                  <>
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt={`${tourData.title} - Additional Image 1`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt={`${tourData.title} - Additional Image 2`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Booking Form */}
        <div>
          <div className="sticky top-24">
            <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
              <div className="text-3xl font-bold mb-2">{formatCurrency(tourData.price)}</div>
              <div className="text-sm text-gray-500 mb-4">per person</div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{tourData.duration} days</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Group Size</span>
                  <span className="font-medium">Up to {tourData.maxGroupSize} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Difficulty</span>
                  <span className="font-medium capitalize">{tourData.difficulty}</span>
                </div>
              </div>
            </div>

            <TourBookingForm tourId={params.id} tourName={tourData.title} />
          </div>
        </div>
      </div>
    </div>
  )
}

