import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, Calendar, Users, CreditCard, ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react"
import { bookingService, roomService } from "@/lib/db"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default async function BookingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/dashboard/bookings")
  }

  // Fetch bookings for the current user
  const bookings = await bookingService.getByUserId(user.id)

  // Enrich bookings with room data
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      const room = await roomService.getById(booking.roomId)
      return {
        ...booking,
        room,
      }
    }),
  )

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-2">View and manage your current and past bookings</p>
      </div>

      {enrichedBookings.length > 0 ? (
        <div className="grid gap-6">
          {enrichedBookings.map((booking) => (
            <Card key={booking._id} className="overflow-hidden">
              <div className="md:flex">
                {/* Room Image */}
                <div className="relative h-48 md:h-auto md:w-1/3">
                  {booking.room?.images && booking.room.images.length > 0 ? (
                    <Image
                      src={booking.room.images[0] || "/placeholder.svg"}
                      alt={booking.room?.name || "Room"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <CalendarClock className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="p-6 md:w-2/3">
                  <CardHeader className="p-0 pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{booking.room?.name || "Room Booking"}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        <StatusIcon status={booking.status} />
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 space-y-4">
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
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Guests</p>
                          <p className="font-medium">{booking.guests}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Price</p>
                          <p className="font-medium">{formatCurrency(booking.totalPrice)}</p>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div>
                        <p className="text-sm text-muted-foreground">Special Requests</p>
                        <p className="text-sm">{booking.specialRequests}</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-0 pt-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Booking ID: {booking.bookingId || `INV_${new Date(booking.createdAt).getFullYear()}_0001`}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/bookings/${booking._id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarClock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't made any bookings yet. Start exploring our available rooms and properties.
            </p>
            <Button asChild>
              <a href="/rooms">Browse Rooms</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

