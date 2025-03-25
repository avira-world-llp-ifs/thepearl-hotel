import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatCurrency, calculateNights } from "@/lib/utils"
import { getBookingById } from "@/services/booking-service"
import { UpdateBookingStatus } from "./update-booking-status"
import { ViewInvoiceButton } from "./view-invoice-button"
import { ArrowLeft, Calendar, Users, CreditCard, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

async function BookingDetails({ params }: { params: { id: string } }) {
  const booking = await getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
          <p className="text-muted-foreground">View and manage booking information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/admin/bookings">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Bookings
            </Button>
          </Link>
          <ViewInvoiceButton bookingId={booking._id as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
            <CardDescription>Booking #{booking._id?.substring(0, 8).toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Room</h3>
                <p className="text-lg font-medium">{booking.roomName || booking.roomType}</p>
                <p className="text-sm text-muted-foreground">{booking.roomType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Booking Status</h3>
                <div className="mt-1">
                  <UpdateBookingStatus bookingId={booking._id as string} currentStatus={booking.status || "pending"} />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Check-in</h3>
                  <p>{formatDate(booking.checkIn)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Check-out</h3>
                  <p>{formatDate(booking.checkOut)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Guests</h3>
                  <p>
                    {booking.guests || (booking.adults || 0) + (booking.children || 0)}{" "}
                    {(booking.guests || (booking.adults || 0) + (booking.children || 0)) === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Duration</h3>
                  <p>
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Payment Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Payment Status</h4>
                    <p className="capitalize">{booking.paymentStatus || "pending"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Total Amount</h4>
                  <p className="text-xl font-bold">{formatCurrency(booking.totalPrice || booking.totalAmount || 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="font-medium">{booking.customerName || booking.guestName || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="font-medium">{booking.customerEmail || booking.email || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p className="font-medium">{booking.customerPhone || booking.phone || "N/A"}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Booking Date</h3>
              <p>{booking.createdAt ? formatDate(booking.createdAt) : "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading booking details...</div>}>
      <BookingDetails params={params} />
    </Suspense>
  )
}

