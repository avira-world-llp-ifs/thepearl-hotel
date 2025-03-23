import { type NextRequest, NextResponse } from "next/server"
import { bookingService, roomService, userService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { formatDate, formatPrice } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "month"
    const status = searchParams.get("status") || "all"
    const fromDate = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined
    const toDate = searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date()

    // Get all bookings
    const bookings = await bookingService.getAll()

    // Filter bookings by date range and status
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)

      if (fromDate && bookingDate < fromDate) {
        return false
      }

      if (toDate && bookingDate > toDate) {
        return false
      }

      if (status !== "all" && booking.status !== status) {
        return false
      }

      return true
    })

    // Enrich bookings with room and user data
    const enrichedBookings = await Promise.all(
      filteredBookings.map(async (booking) => {
        const room = await roomService.getById(booking.roomId)
        const user = await userService.getById(booking.userId)

        return {
          ...booking,
          roomName: room?.name || "Unknown Room",
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "Unknown Email",
        }
      }),
    )

    // Generate CSV content
    let csvContent = "Booking ID,Guest Name,Guest Email,Room,Check-in,Check-out,Status,Total Price,Created At\n"

    enrichedBookings.forEach((booking) => {
      csvContent +=
        [
          booking._id.toString(),
          booking.userName,
          booking.userEmail,
          booking.roomName,
          formatDate(booking.checkIn),
          formatDate(booking.checkOut),
          booking.status,
          formatPrice(booking.totalPrice).replace("$", ""),
          formatDate(booking.createdAt),
        ]
          .map((value) => `"${value}"`)
          .join(",") + "\n"
    })

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bookings-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting booking report:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to export booking report" }, { status: 500 })
  }
}

