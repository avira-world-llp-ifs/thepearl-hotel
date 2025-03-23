"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users, SquareIcon as SquareFeet, Check, Loader2 } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import FallbackImage from "./fallback-image"

// Update the handleBookNow function to check login status and redirect to confirmation page
export default function RoomDetail({ room }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  })
  const [guests, setGuests] = useState(1)
  const [selectedImage, setSelectedImage] = useState(
    room.images && room.images.length > 0
      ? room.images[0]
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
  )

  const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"

  const handleBookNow = () => {
    if (!date?.from || !date?.to) {
      alert("Please select check-in and check-out dates")
      return
    }

    setIsLoading(true)

    try {
      // Calculate nights and total price
      const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
      const roomTotal = room.price * nights
      const cleaningFee = 1000
      const serviceFee = 500
      const totalPrice = roomTotal + cleaningFee + serviceFee

      // Create booking data object
      const bookingData = {
        roomId: room._id.toString(),
        checkInDate: date.from.toISOString(),
        checkOutDate: date.to.toISOString(),
        numberOfGuests: guests,
        totalPrice: totalPrice,
        bookingStatus: "pending",
      }

      // Store booking data in session storage
      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData))

      if (session?.user) {
        // User is logged in, proceed to confirmation
        router.push("/booking/confirm")
      } else {
        // User is not logged in, redirect to login with return URL
        router.push(`/login?redirect=/booking/confirm`)
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("There was an error processing your booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
      <p className="text-muted-foreground mb-8">{room.location}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-[400px] mb-4 rounded-lg overflow-hidden">
            <FallbackImage
              src={selectedImage}
              fallbackSrc={fallbackImage}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-8">
            {room.images && room.images.length > 0 ? (
              room.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative h-20 cursor-pointer rounded-md overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                >
                  <FallbackImage
                    src={image}
                    fallbackSrc={fallbackImage}
                    alt={`${room.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 16vw"
                  />
                </div>
              ))
            ) : (
              <div className="relative h-20 cursor-pointer rounded-md overflow-hidden">
                <Image
                  src={fallbackImage || "/placeholder.svg"}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 16vw"
                />
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-4">About this room</h2>
          <p className="text-muted-foreground mb-6">{room.description}</p>

          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {room.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <span className="text-2xl font-bold">{formatPrice(room.price).replace("$", "₹")}</span>
                <span className="text-muted-foreground"> / night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Dates</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Guests</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={guests}
                    onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>
                    {formatPrice(room.price).replace("$", "₹")} x{" "}
                    {date?.to && date?.from
                      ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
                      : 0}{" "}
                    nights
                  </span>
                  <span>
                    {formatPrice(
                      room.price *
                        (date?.to && date?.from
                          ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
                          : 0),
                    ).replace("$", "₹")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>{formatPrice(1000).replace("$", "₹")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{formatPrice(500).replace("$", "₹")}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {formatPrice(
                      room.price *
                        (date?.to && date?.from
                          ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
                          : 0) +
                        1500,
                    ).replace("$", "₹")}
                  </span>
                </div>
              </div>

              <Button className="w-full" onClick={handleBookNow} disabled={isLoading || !date?.from || !date?.to}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Book Now"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">You won't be charged yet</p>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between bg-muted p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>{room.capacity} guests maximum</span>
            </div>
            <div className="flex items-center">
              <SquareFeet className="h-5 w-5 mr-2" />
              <span>{room.size} sq ft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

