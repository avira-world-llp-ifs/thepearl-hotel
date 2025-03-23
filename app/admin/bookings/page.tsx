import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { bookingService, roomService, userService } from "@/lib/db"
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils"
import { Eye, PlusCircle } from "lucide-react"

export default async function AdminBookingsPage() {
  // Get bookings directly from the service
  const bookings = await bookingService.getAll()

  // Sort bookings by updatedAt in descending order (newest first)
  bookings.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime()
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime()
    return dateB - dateA // Descending order
  })

  // Enrich bookings with room and user data
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      try {
        const room = await roomService.getById(booking.roomId)
        const user = await userService.getById(booking.userId)

        return {
          ...booking,
          roomName: room?.name || "Unknown Room",
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "Unknown Email",
        }
      } catch (error) {
        console.error(`Error enriching booking ${booking._id}:`, error)
        return {
          ...booking,
          roomName: "Unknown Room",
          userName: "Unknown User",
          userEmail: "Unknown Email",
        }
      }
    }),
  )

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button asChild>
          <Link href="/admin/bookings/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Booking
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Button asChild variant="outline">
          <Link href="/admin/bookings">All Bookings</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/bookings/approved">Approved</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/bookings/cancelled">Cancelled</Link>
        </Button>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        {!enrichedBookings || enrichedBookings.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No bookings found. Create your first booking to get started.</p>
            <Button asChild>
              <Link href="/admin/bookings/new">Create Booking</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Booking ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Room</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Guest</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Check-in</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Check-out</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Last Updated</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrichedBookings.map((booking) => (
                  <tr key={booking._id.toString()} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium">
                      {booking.bookingId ||
                        `INV_${new Date(booking.createdAt).getFullYear()}_${booking._id.toString().slice(-4).padStart(4, "0")}`}
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.roomName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{booking.userName}</div>
                        <div className="text-xs text-muted-foreground">{booking.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.checkIn)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.checkOut)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className={`${getStatusColor(booking.status)} capitalize`}>{booking.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatPrice(booking.totalPrice)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.updatedAt || booking.createdAt)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/bookings/${booking._id.toString()}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/bookings/${booking._id.toString()}/invoice`}>Invoice</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

