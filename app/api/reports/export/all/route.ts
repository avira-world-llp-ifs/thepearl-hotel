import { type NextRequest, NextResponse } from "next/server"
import { bookingService, roomService, userService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { formatDate, formatPrice } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    // Get all data
    const rooms = await roomService.getAll()
    const bookings = await bookingService.getAll()
    const users = await userService.getAll()

    // Generate CSV content for bookings
    let bookingsCsv = "Booking ID,Guest Name,Guest Email,Room,Check-in,Check-out,Status,Total Price,Created At\n"

    for (const booking of bookings) {
      const room = await roomService.getById(booking.roomId)
      const user = await userService.getById(booking.userId)

      bookingsCsv +=
        [
          booking._id.toString(),
          user?.name || "Unknown User",
          user?.email || "Unknown Email",
          room?.name || "Unknown Room",
          formatDate(booking.checkIn),
          formatDate(booking.checkOut),
          booking.status,
          formatPrice(booking.totalPrice).replace("$", ""),
          formatDate(booking.createdAt),
        ]
          .map((value) => `"${value}"`)
          .join(",") + "\n"
    }

    // Generate CSV content for rooms
    let roomsCsv = "Room ID,Name,Price,Capacity,Size,Featured,Amenities\n"

    for (const room of rooms) {
      roomsCsv +=
        [
          room._id.toString(),
          room.name,
          formatPrice(room.price).replace("$", ""),
          room.capacity,
          room.size,
          room.featured ? "Yes" : "No",
          room.amenities.join(", "),
        ]
          .map((value) => `"${value}"`)
          .join(",") + "\n"
    }

    // Generate CSV content for users
    let usersCsv = "User ID,Name,Email,Role,Created At\n"

    for (const user of users) {
      usersCsv +=
        [user._id.toString(), user.name, user.email, user.role, formatDate(user.createdAt)]
          .map((value) => `"${value}"`)
          .join(",") + "\n"
    }

    // Combine all CSV content
    const combinedCsv =
      "BOOKINGS REPORT\n\n" + bookingsCsv + "\n\nROOMS REPORT\n\n" + roomsCsv + "\n\nUSERS REPORT\n\n" + usersCsv

    // Return CSV file
    return new NextResponse(combinedCsv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="hotel-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting all reports:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to export reports" }, { status: 500 })
  }
}

