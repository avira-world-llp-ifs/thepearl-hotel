import { type NextRequest, NextResponse } from "next/server"
import { bookingService } from "@/lib/db"
import { requireAuth, requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await requireAuth()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const sort = searchParams.get("sort") || "desc" // Default to descending
    const sortBy = searchParams.get("sortBy") || "updatedAt" // Default to updatedAt

    // If userId is specified and it's not the current user's ID, require admin
    if (userId && userId !== user._id.toString()) {
      await requireAdmin()
    }

    // Get bookings
    let bookings = await bookingService.getAll()

    // Filter by userId if specified
    if (userId) {
      bookings = bookings.filter((booking) => booking.userId.toString() === userId)
    }

    // Filter by status if specified
    if (status) {
      bookings = bookings.filter((booking) => booking.status === status)
    }

    // Sort bookings based on sortBy and sort parameters
    bookings.sort((a, b) => {
      const aValue = a[sortBy] ? new Date(a[sortBy]).getTime() : 0
      const bValue = b[sortBy] ? new Date(b[sortBy]).getTime() : 0

      return sort === "asc"
        ? aValue - bValue // Ascending order
        : bValue - aValue // Descending order
    })

    // Limit the number of results if specified
    if (limit) {
      bookings = bookings.slice(0, limit)
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// Add the POST method to create a new booking
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    await requireAuth()

    // Get booking data from request body
    const data = await request.json()

    // Validate required fields
    if (!data.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }
    if (!data.roomId) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
    }
    if (!data.checkInDate && !data.checkIn) {
      return NextResponse.json({ error: "Check-in date is required" }, { status: 400 })
    }
    if (!data.checkOutDate && !data.checkOut) {
      return NextResponse.json({ error: "Check-out date is required" }, { status: 400 })
    }

    // Normalize data
    const bookingData = {
      userId: data.userId,
      roomId: data.roomId,
      checkIn: data.checkIn || data.checkInDate,
      checkOut: data.checkOut || data.checkOutDate,
      guests: data.guests || data.numberOfGuests || 1,
      specialRequests: data.specialRequests || "",
      totalPrice: data.totalPrice || 0,
      status: data.status || "pending",
      paymentStatus: data.paymentStatus || "pending",
    }

    // Create booking
    const booking = await bookingService.create(bookingData)

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error creating booking:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

