import { type NextRequest, NextResponse } from "next/server"
import { bookingService, roomService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { formatDate, formatPrice } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "month"
    const fromDate = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined
    const toDate = searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date()

    // Get all bookings
    const bookings = await bookingService.getAll()

    // Filter bookings by date range and only include confirmed, approved, or completed bookings
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)

      if (fromDate && bookingDate < fromDate) {
        return false
      }

      if (toDate && bookingDate > toDate) {
        return false
      }

      // Only include bookings that generate revenue
      return ["confirmed", "approved", "completed"].includes(booking.status)
    })

    // Enrich bookings with room data
    const enrichedBookings = await Promise.all(
      filteredBookings.map(async (booking) => {
        const room = await roomService.getById(booking.roomId)

        return {
          ...booking,
          roomName: room?.name || "Unknown Room",
          roomPrice: room?.price || 0,
        }
      }),
    )

    // Generate CSV content
    let csvContent = "Date,Booking ID,Room,Room Price,Nights,Total Price,Status\n"

    enrichedBookings.forEach((booking) => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

      csvContent +=
        [
          formatDate(booking.createdAt),
          booking._id.toString(),
          booking.roomName,
          formatPrice(booking.roomPrice).replace("$", ""),
          nights,
          formatPrice(booking.totalPrice).replace("$", ""),
          booking.status,
        ]
          .map((value) => `"${value}"`)
          .join(",") + "\n"
    })

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="revenue-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting revenue report:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to export revenue report" }, { status: 500 })
  }
}

