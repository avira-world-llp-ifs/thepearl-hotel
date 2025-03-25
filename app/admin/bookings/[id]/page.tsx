import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { bookingService, roomService, userService } from "@/lib/db"
import { formatDate, getStatusColor, calculateNights } from "@/lib/utils"
import { ArrowLeft, Calendar, Users, FileText } from "lucide-react"
import { UpdateBookingStatusForm } from "@/components/admin/update-booking-status-form"

interface BookingDetailPageProps {
  params: {
    id: string
  }
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const booking = await bookingService.getById(params.id)

  if (!booking) {
    notFound()
  }

  const room = await roomService.getById(booking.roomId)
  const user = await userService.getById(booking.userId)

  if (!room || !user) {
    notFound()
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut)

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Booking Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Booking{" "}
                {booking.bookingId ||
                  `INV_${new Date(booking.createdAt).getFullYear()}_${booking._id.toString().slice(-4).padStart(4, "0")}`}
              </CardTitle>
              <Badge className={`${getStatusColor(booking.status)} capitalize`}>{booking.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Guest Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {user.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Room Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Room:</span> {room.name}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span> ₹{room.price}/night
                    </p>
                    <p>
                      <span className="font-medium">Capacity:</span> {room.capacity} guests
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-lg flex flex-col">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">Check-in</span>
                  </div>
                  <p>{formatDate(booking.checkIn)}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg flex flex-col">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">Check-out</span>
                  </div>
                  <p>{formatDate(booking.checkOut)}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg flex flex-col">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">Guests</span>
                  </div>
                  <p>
                    {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>{booking.specialRequests}</p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      ₹{room.price} x {nights} nights
                    </span>
                    <span>₹{room.price * nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₹{booking.totalPrice * 0.1}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{booking.totalPrice}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <UpdateBookingStatusForm booking={booking} />

              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link href={`/admin/bookings/${booking._id.toString()}/invoice`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Invoice
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

