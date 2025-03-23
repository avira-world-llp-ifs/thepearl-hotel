import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { bookingService, roomService } from "@/lib/db"
import { formatDate, formatPrice, getStatusColor, calculateNights } from "@/lib/utils"
import { Calendar, MapPin, Users } from "lucide-react"

export default async function BookingsPage() {
  const user = await requireAuth()

  const bookings = bookingService.getByUserId(user.id)

  if (bookings.length === 0) {
    return (
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
              <p className="text-muted-foreground">You haven&apos;t made any bookings yet.</p>
            </div>
            <Button asChild>
              <Link href="/rooms">Browse Rooms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <div className="space-y-6">
        {bookings.map((booking) => {
          const room = roomService.getById(booking.roomId)
          if (!room) return null

          const nights = calculateNights(booking.checkIn, booking.checkOut)

          return (
            <Card key={booking.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="relative h-48 md:h-auto md:w-1/3 md:flex-shrink-0">
                  <Image src="/placeholder.svg?height=400&width=600" alt={room.name} fill className="object-cover" />
                </div>
                <div className="p-6 md:flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{room.name}</h2>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Luxury Hotel, New York</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} capitalize self-start md:ml-2`}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">Check-in</span>
                      </div>
                      <p className="font-medium">{formatDate(booking.checkIn)}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">Check-out</span>
                      </div>
                      <p className="font-medium">{formatDate(booking.checkOut)}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">Guests</span>
                      </div>
                      <p className="font-medium">
                        {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        {nights} {nights === 1 ? "night" : "nights"} • Booked on {formatDate(booking.createdAt)}
                      </p>
                      <p className="font-bold text-lg">Total: {formatPrice(booking.totalPrice)}</p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      {booking.status === "pending" || booking.status === "confirmed" ? (
                        <Button variant="outline" asChild>
                          <Link href={`/bookings/${booking.id}/cancel`}>Cancel</Link>
                        </Button>
                      ) : null}
                      <Button asChild>
                        <Link href={`/bookings/${booking.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

