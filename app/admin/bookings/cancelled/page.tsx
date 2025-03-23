import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Eye } from "lucide-react"
import Link from "next/link"
import { bookingService, roomService, userService } from "@/lib/db"

export default async function CancelledBookingsPage() {
  // Instead of using bookingService.getByStatus("cancelled")
  // Get all bookings and filter them in JavaScript
  const allBookings = await bookingService.getAll()
  const bookings = allBookings.filter(
    (booking) => booking.bookingStatus === "cancelled" || booking.status === "cancelled",
  )

  // Enrich bookings with room and user data
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      const room = await roomService.getById(booking.roomId)
      const user = await userService.getById(booking.userId)

      return {
        ...booking,
        roomName: room?.name || "Unknown Room",
        roomImage: room?.images?.[0] || "/placeholder.svg",
        roomType: room?.type || "Standard",
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "Unknown Email",
      }
    }),
  )

  return (
    <div className="md:pt-0 pt-10">
      <h1 className="text-3xl font-bold mb-6">Cancelled Bookings</h1>

      <div className="bg-background rounded-lg border shadow-sm">
        {!enrichedBookings || enrichedBookings.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No cancelled bookings found.</p>
            <Button asChild>
              <Link href="/admin/bookings">View All Bookings</Link>
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
                  <th className="px-4 py-3 text-left text-sm font-medium">Cancelled On</th>
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
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={booking.roomImage || "/placeholder.svg"}
                          alt={booking.roomName}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{booking.roomName}</div>
                          <div className="text-xs text-muted-foreground">{booking.roomType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{booking.userName}</div>
                        <div className="text-xs text-muted-foreground">{booking.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.checkIn)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.checkOut)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.updatedAt)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/bookings/${booking._id.toString()}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
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

