import { notFound } from "next/navigation"
import { getBookingById } from "@/services/booking-service"
import { formatDate, formatCurrency, calculateNights } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Printer } from "lucide-react"

export default async function InvoicePage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const booking = await getBookingById(params.id)

    if (!booking) {
      return notFound()
    }

    const nights = calculateNights(booking.checkIn, booking.checkOut)

    return (
      <div className="container mx-auto p-6 bg-white">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/admin/bookings/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Booking
            </Button>
          </Link>
          <PrintButton />
        </div>

        <div className="max-w-4xl mx-auto border border-gray-200 p-8 rounded-lg shadow-sm print:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-amber-600">Hotel The Pearl</h1>
              <p className="text-gray-600">5-Star Luxury Hotel</p>
              <p className="text-gray-600">New Delhi, India</p>
              <p className="text-gray-600">+91 (11) 23633363, 23634363</p>
              <p className="text-gray-600">hotelthepearl55@gmail.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-gray-600">Invoice #: INV-{booking._id?.toString().substring(0, 8).toUpperCase()}</p>
              <p className="text-gray-600">Date: {formatDate(new Date())}</p>
              <p className="text-gray-600">Booking ID: {booking._id?.toString()}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
            <p>{booking.customerName || booking.guestName || "Guest"}</p>
            <p>{booking.customerEmail || booking.email || "N/A"}</p>
            <p>{booking.customerPhone || booking.phone || "N/A"}</p>
          </div>

          {/* Booking Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Booking Details:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="py-2 px-4 border-b text-left">Description</th>
                    <th className="py-2 px-4 border-b text-left">Check-in</th>
                    <th className="py-2 px-4 border-b text-left">Check-out</th>
                    <th className="py-2 px-4 border-b text-left">Nights</th>
                    <th className="py-2 px-4 border-b text-left">Guests</th>
                    <th className="py-2 px-4 border-b text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">{booking.roomName || booking.roomType}</td>
                    <td className="py-2 px-4 border-b">{formatDate(booking.checkIn)}</td>
                    <td className="py-2 px-4 border-b">{formatDate(booking.checkOut)}</td>
                    <td className="py-2 px-4 border-b">{nights}</td>
                    <td className="py-2 px-4 border-b">
                      {booking.guests || (booking.adults || 0) + (booking.children || 0)}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {formatCurrency(booking.totalPrice || booking.totalAmount || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">{formatCurrency(booking.totalPrice || booking.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold">Payment Status:</span>
                <span
                  className={`font-semibold ${
                    (booking.paymentStatus || "pending") === "paid" ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {(booking.paymentStatus || "Pending").toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm mt-16">
            <p>Thank you for choosing Hotel The Pearl. We look forward to serving you again.</p>
            <p className="mt-1">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading invoice:", error)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h2 className="text-lg font-semibold mb-2">Error Loading Invoice</h2>
          <p>There was a problem loading the invoice. Please try again later.</p>
          <div className="mt-4">
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bookings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
// Client component for print functionality
;("use client")
function PrintButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
      <Printer className="mr-2 h-4 w-4" />
      Print Invoice
    </Button>
  )
}

