import { getCurrentUser } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, Calendar, Users, ArrowLeft, CheckCircle, Clock, XCircle, MapPin, Home } from "lucide-react"
import { bookingService, roomService } from "@/lib/db"
import { formatDate, formatCurrency, formatBookingId } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default async function BookingDetailsPage({ params }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/dashboard/bookings")
  }

  // Fetch booking details
  const booking = await bookingService.getById(params.id)

  // Check if booking exists and belongs to the current user
  if (!booking || booking.userId !== user.id) {
    notFound()
  }

  // Fetch room details
  const room = await roomService.getById(booking.roomId)

  // Calculate stay duration
  const checkIn = new Date(booking.checkIn)
  const checkOut = new Date(booking.checkOut)
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  // Format booking ID
  const formattedBookingId = booking.bookingId || formatBookingId(booking._id.toString())

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Function to get status icon
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "confirmed":
      case "approved":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />
      case "cancelled":
        return <XCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Booking Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Booking Information</CardTitle>
              <Badge className={getStatusColor(booking.status)}>
                <StatusIcon status={booking.status} />
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">{formatDate(booking.checkIn)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">{formatDate(booking.checkOut)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-medium">{booking.guests}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Payment Details</h3>
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>
                    Room Rate ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                  <span>{formatCurrency(booking.totalPrice)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(booking.totalPrice)}</span>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <div>
                <h3 className="font-medium mb-2">Special Requests</h3>
                <p className="bg-muted p-4 rounded-md">{booking.specialRequests}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Booking ID</h3>
              <p className="bg-muted p-4 rounded-md font-mono text-center">{formattedBookingId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Room Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 rounded-md overflow-hidden">
                {room?.images && room.images.length > 0 ? (
                  <Image
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room?.name || "Room"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Home className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <h3 className="font-bold text-lg">{room?.name || "Room"}</h3>

              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Capacity: {room?.capacity || "N/A"} guests</span>
              </div>

              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Size: {room?.size || "N/A"} m²</span>
              </div>

              {room?.description && <p className="text-sm text-muted-foreground">{room.description}</p>}

              <Button className="w-full" asChild>
                <Link href={`/rooms/${room?._id}`}>View Room Details</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you need to modify or cancel your booking, please contact our customer service.
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-600">+91 (11) 23633363, 23634363</p>
                <p className="text-gray-600">hotelthepearl55@gmail.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

