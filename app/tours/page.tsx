import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Calendar, ArrowRight, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import ToursSkeleton from "@/components/tours-skeleton"

export const metadata = {
  title: "Tour Packages | The Pearl Hotel",
  description: "Explore our curated tour packages and discover the beauty of India.",
}

export const revalidate = 0 // Revalidate on every request

async function getTours() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
    console.log("Fetching tours from:", `${baseUrl}/api/tours`)

    const res = await fetch(`${baseUrl}/api/tours`, {
      next: { revalidate: 0 }, // Revalidate on every request
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch tours: ${res.status}`)
    }

    const data = await res.json()
    console.log("Tours data:", data) // Debug log

    // Handle different response formats
    const tours = Array.isArray(data) ? data : data.tours || []
    return tours
  } catch (error) {
    console.error("Error fetching tours:", error)
    return []
  }
}

function formatDate(dateString: string) {
  if (!dateString) return "Flexible"
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    return "Flexible"
  }
}

export default function ToursPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Tour Packages</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the beauty and culture of India with our carefully curated tour packages. From historical monuments
          to spiritual journeys, we offer experiences for every traveler.
        </p>
      </div>

      <Suspense fallback={<ToursSkeleton />}>
        <ToursGrid />
      </Suspense>
    </div>
  )
}

async function ToursGrid() {
  const tours = await getTours()

  if (!tours || tours.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No Tours Available</h2>
        <p className="text-muted-foreground">Please check back later for our upcoming tour packages.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour: any) => (
        <TourCard key={tour._id} tour={tour} />
      ))}
    </div>
  )
}

function TourCard({ tour }: { tour: any }) {
  // Ensure we have an ID, even if it's in different formats
  const tourId = tour._id || tour.id || ""

  // Check if the tour has a valid image
  const hasValidImage = tour.image && typeof tour.image === "string" && tour.image.trim() !== ""
  const hasValidImages = Array.isArray(tour.images) && tour.images.length > 0 && tour.images[0].trim() !== ""

  // Use the first image from the images array if available, otherwise use the image property
  const imageUrl = hasValidImages ? tour.images[0] : hasValidImage ? tour.image : null

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={tour.title || "Tour Package"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
            <span className="sr-only">No image available</span>
          </div>
        )}
      </div>
      <CardContent className="pt-6 flex-grow">
        <h2 className="text-xl font-bold mb-2">{tour.title || "Tour Package"}</h2>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {tour.description || "Experience an amazing journey with our carefully curated tour package."}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{tour.location || "Various Locations"}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{tour.duration || "N/A"} days</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>Starts: {formatDate(tour.startDate || tour.startDates?.[0])}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 flex justify-between items-center">
        <div className="font-bold text-lg">
          ₹{(tour.price || 0).toLocaleString()}
          <span className="text-xs text-muted-foreground ml-1">per person</span>
        </div>
        <Link href={`/tours/${tourId}`} passHref>
          <Button>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

