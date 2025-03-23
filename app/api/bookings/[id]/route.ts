import { type NextRequest, NextResponse } from "next/server"
import { bookingService, roomService, userService } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const booking = await bookingService.getById(params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if the booking belongs to the user or if the user is an admin
    if (booking.userId.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Enrich booking with room and user data
    const room = await roomService.getById(booking.roomId)
    const bookingUser = await userService.getById(booking.userId)

    const enrichedBooking = {
      ...booking,
      roomName: room?.name || "Unknown Room",
      userName: bookingUser?.name || "Unknown User",
      userEmail: bookingUser?.email || "Unknown Email",
    }

    return NextResponse.json(enrichedBooking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const booking = await bookingService.getById(params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if the booking belongs to the user or if the user is an admin
    if (booking.userId.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Regular users can only update status to 'cancelled'
    if (user.role !== "admin" && data.status && data.status !== "cancelled") {
      return NextResponse.json({ error: "Unauthorized to change status" }, { status: 403 })
    }

    const updatedBooking = await bookingService.update(params.id, data)

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Only admins can delete bookings
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const booking = await bookingService.getById(params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    await bookingService.delete(params.id)

    return NextResponse.json({ success: true, message: "Booking deleted successfully" })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}

