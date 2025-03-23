"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  CalendarIcon,
  MapPinIcon,
  Clock,
  Users,
  CheckCircle,
  Info,
  Calendar,
  DollarSign,
  Star,
  Compass,
  Utensils,
  Bed,
  Bus,
} from "lucide-react"

interface TourDetailProps {
  tour: any
}

export default function TourDetail({ tour }: TourDetailProps) {
  console.log("Tour data in component:", tour) // Debug log

  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participants: 1,
    travelDate: "",
    specialRequests: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "participants" ? Math.min(Math.max(1, Number.parseInt(value) || 1), tourData.maxParticipants) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${baseUrl}/api/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tourId: tour._id,
          tourName: tour.title,
          status: "pending",
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to submit enquiry")
      }

      toast({
        title: "Enquiry Submitted",
        description: "We've received your tour enquiry and will contact you soon.",
        variant: "default",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        participants: 1,
        travelDate: "",
        specialRequests: "",
      })

      // Redirect to thank you page or stay on same page
      if (session?.user) {
        router.push("/dashboard/enquiries")
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error)
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your enquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
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

  // Fallback values for missing data
  const tourData = {
    title: tour.title || "Tour Package",
    description: tour.description || "Experience an amazing journey with our carefully curated tour package.",
    image: tour.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070",
    duration: tour.duration || "N/A",
    location: tour.location || "Various Locations",
    price: tour.price || 0,
    startDate: tour.startDate || tour.startDates?.[0] || new Date().toISOString(),
    maxParticipants: tour.maxParticipants || tour.maxGroupSize || 10,
    highlights: tour.highlights || [
      "Guided tours of major attractions",
      "Comfortable accommodation",
      "Transportation included",
      "Experienced tour guides",
    ],
    inclusions: tour.inclusions || ["Accommodation", "Transportation", "Tour guide", "Entrance fees"],
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
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
        <Image src={tourData.image || "/placeholder.svg"} alt={tourData.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{tourData.title}</h1>
          <div className="flex flex-wrap gap-4 text-white">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{tourData.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{tourData.duration} days</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Starts: {formatDate(tourData.startDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tour Details */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Tour Overview</h2>
                <p className="text-muted-foreground whitespace-pre-line">{tourData.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Compass className="h-5 w-5 mr-2 text-primary" />
                      Tour Details
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{tourData.duration} days</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{tourData.location}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Group Size:</span>
                        <span className="font-medium">Max {tourData.maxParticipants} people</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">{formatDate(tourData.startDate)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <span className="font-medium">{tour.difficulty || "Easy"}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Star className="h-5 w-5 mr-2 text-primary" />
                      Highlights
                    </h3>
                    <ul className="space-y-2">
                      {tourData.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Utensils className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Meals</h3>
                    <p className="text-sm text-muted-foreground">{tour.meals || "Selected meals included"}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Accommodation</h3>
                    <p className="text-sm text-muted-foreground">{tour.accommodation || "Comfortable hotels"}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Bus className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Transportation</h3>
                    <p className="text-sm text-muted-foreground">{tour.transportation || "Air-conditioned vehicles"}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="mt-6 space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Tour Itinerary</h2>
              <div className="space-y-8">
                {tourData.itinerary.map((day: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-6 pb-6 relative">
                    <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0"></div>
                    <h3 className="text-xl font-semibold">
                      Day {day.day || index + 1}: {day.title}
                    </h3>
                    <p className="text-muted-foreground mt-2">{day.description}</p>

                    {day.accommodation && (
                      <div className="mt-3 flex items-center text-sm">
                        <Bed className="h-4 w-4 mr-2 text-primary" />
                        <span>Accommodation: {day.accommodation}</span>
                      </div>
                    )}

                    {day.meals && day.meals.length > 0 && (
                      <div className="mt-2 flex items-center text-sm">
                        <Utensils className="h-4 w-4 mr-2 text-primary" />
                        <span>Meals: {day.meals.join(", ")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Inclusions Tab */}
            <TabsContent value="inclusions" className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {tourData.inclusions.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Info className="h-5 w-5 text-red-500 mr-2" />
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {tourData.exclusions.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Info className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Tour Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(tour.images || [tourData.image]).map((image: string, index: number) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070"}
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
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070"
                        alt={`${tourData.title} - Additional Image 1`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070"
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
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Tour Price</h3>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">₹{tourData.price.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">per person</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>Max: {tourData.maxParticipants} people</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>{tourData.duration} days</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Book This Tour</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participants">Number of Participants</Label>
                    <Input
                      id="participants"
                      name="participants"
                      type="number"
                      min="1"
                      max={tourData.maxParticipants}
                      value={formData.participants}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelDate">Preferred Travel Date</Label>
                    <Input
                      id="travelDate"
                      name="travelDate"
                      type="date"
                      value={formData.travelDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground mt-4">
                  By submitting this form, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

