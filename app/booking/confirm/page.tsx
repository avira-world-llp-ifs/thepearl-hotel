"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function BookingConfirmPage() {
  const router = useRouter()
  // Fix useSession to handle undefined safely
  const session = useSession()
  const [bookingData, setBookingData] = useState<any>(null)
  const [room, setRoom] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (session?.status === "unauthenticated") {
      router.push("/login?redirect=/booking/confirm")
      return
    }

    // Get booking data from session storage
    const storedBooking = sessionStorage.getItem("pendingBooking")
    if (!storedBooking) {
      router.push("/rooms")
      return
    }

    const parsedBooking = JSON.parse(storedBooking)
    setBookingData(parsedBooking)

    // Fetch room details
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${parsedBooking.roomId}`)
        if (!response.ok) throw new Error("Failed to fetch room")
        const roomData = await response.json()
        setRoom(roomData)
      } catch (error) {
        console.error("Error fetching room:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    fetchRoom()
  }, [router, session?.status])

  const handleConfirmBooking = async () => {
    if (!session?.data?.user?.id) {
      alert("You must be logged in to complete this booking")
      return
    }

    setIsLoading(true)

    try {
      // Add user ID to booking data and normalize field names
      const completeBookingData = {
        userId: session.data.user.id,
        roomId: bookingData.roomId,
        checkIn: bookingData.checkInDate,
        checkOut: bookingData.checkOutDate,
        guests: bookingData.numberOfGuests,
        totalPrice: bookingData.totalPrice,
        specialRequests: bookingData.specialRequests || "",
        status: "pending",
        paymentStatus: "pending",
      }

      // Submit booking to API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeBookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create booking")
      }

      // Clear session storage
      sessionStorage.removeItem("pendingBooking")

      // Redirect to bookings page
      router.push("/dashboard/bookings")
    } catch (error: any) {
      console.error("Error confirming booking:", error)
      alert(error.message || "There was an error confirming your booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!bookingData || !room) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Booking Error</CardTitle>
            <CardDescription>No booking information found.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/rooms")}>Browse Rooms</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Booking</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Room</h3>
              <p>{room.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Check-in</h3>
                <p>{formatDate(new Date(bookingData.checkInDate))}</p>
              </div>
              <div>
                <h3 className="font-medium">Check-out</h3>
                <p>{formatDate(new Date(bookingData.checkOutDate))}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Guests</h3>
              <p>
                {bookingData.numberOfGuests} {bookingData.numberOfGuests === 1 ? "Guest" : "Guests"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Room Rate</span>
              <span>{formatPrice(room.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning Fee</span>
              <span>{formatPrice(50)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>{formatPrice(bookingData.totalPrice * 0.1)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(bookingData.totalPrice)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button onClick={handleConfirmBooking} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

