"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { formatDate, calculateNights, calculateTotalPrice, formatPrice } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface BookingFormProps {
  room: any // Using any type to accommodate MongoDB document
}

export default function BookingForm({ room }: BookingFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState<string>("1")
  const [isLoading, setIsLoading] = useState(false)

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0
  const totalPrice = checkIn && checkOut ? calculateTotalPrice(room.price, checkIn, checkOut) : 0

  const handleBookNow = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates")
      return
    }

    setIsLoading(true)

    try {
      // Create booking data object
      const bookingData = {
        roomId: room._id.toString(),
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
        numberOfGuests: Number.parseInt(guests),
        totalPrice: totalPrice + 50 + totalPrice * 0.1,
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
    <div className="space-y-4">
      {/* Check-in Date */}
      <div>
        <label className="text-sm font-medium mb-1 block">Check-in</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkIn ? formatDate(checkIn) : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Check-out Date */}
      <div>
        <label className="text-sm font-medium mb-1 block">Check-out</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOut ? formatDate(checkOut) : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              initialFocus
              disabled={(date) => !checkIn || date <= checkIn}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Guests */}
      <div>
        <label className="text-sm font-medium mb-1 block">Guests</label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger>
            <SelectValue placeholder="Number of guests" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(room.capacity)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1} {i === 0 ? "Guest" : "Guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Summary */}
      {checkIn && checkOut && (
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>
              {formatPrice(room.price)} x {nights} nights
            </span>
            <span>{formatPrice(room.price * nights)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Cleaning fee</span>
            <span>{formatPrice(50)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Service fee</span>
            <span>{formatPrice(totalPrice * 0.1)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(totalPrice + 50 + totalPrice * 0.1)}</span>
          </div>
        </div>
      )}

      <Button className="w-full" size="lg" onClick={handleBookNow} disabled={!checkIn || !checkOut || isLoading}>
        {isLoading ? "Processing..." : "Book Now"}
      </Button>
    </div>
  )
}

