import { type NextRequest, NextResponse } from "next/server"
import { bookingService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

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

    // Filter bookings by date range
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

    // Group bookings by period
    let groupedData = []

    switch (period) {
      case "today":
        // Group by hour
        groupedData = groupBookingsByHour(filteredBookings, fromDate || new Date(), toDate)
        break
      case "week":
        // Group by day
        groupedData = groupBookingsByDay(
          filteredBookings,
          fromDate || new Date(new Date().setDate(new Date().getDate() - 7)),
          toDate,
        )
        break
      case "month":
        // Group by day
        groupedData = groupBookingsByDay(filteredBookings, fromDate || new Date(new Date().setDate(1)), toDate)
        break
      case "year":
        // Group by month
        groupedData = groupBookingsByMonth(filteredBookings, fromDate || new Date(new Date().setMonth(0)), toDate)
        break
      case "custom":
        // Determine grouping based on date range
        const daysDiff = Math.ceil((toDate.getTime() - (fromDate?.getTime() || 0)) / (1000 * 60 * 60 * 24))

        if (daysDiff <= 1) {
          groupedData = groupBookingsByHour(filteredBookings, fromDate || toDate, toDate)
        } else if (daysDiff <= 31) {
          groupedData = groupBookingsByDay(filteredBookings, fromDate || toDate, toDate)
        } else {
          groupedData = groupBookingsByMonth(filteredBookings, fromDate || toDate, toDate)
        }
        break
    }

    return NextResponse.json({
      data: groupedData,
      totalBookings: filteredBookings.length,
    })
  } catch (error) {
    console.error("Error fetching booking reports:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch booking reports" }, { status: 500 })
  }
}

// Helper functions for grouping bookings
function groupBookingsByHour(bookings, fromDate, toDate) {
  const result = []
  const hours = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60)) + 1

  for (let i = 0; i < hours; i++) {
    const date = new Date(fromDate)
    date.setHours(date.getHours() + i)

    const hourStart = new Date(date)
    hourStart.setMinutes(0, 0, 0)

    const hourEnd = new Date(date)
    hourEnd.setMinutes(59, 59, 999)

    const hourBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= hourStart && bookingDate <= hourEnd
    })

    const statusBreakdown = {
      pending: hourBookings.filter((b) => b.status === "pending").length,
      confirmed: hourBookings.filter((b) => b.status === "confirmed").length,
      approved: hourBookings.filter((b) => b.status === "approved").length,
      cancelled: hourBookings.filter((b) => b.status === "cancelled").length,
      completed: hourBookings.filter((b) => b.status === "completed").length,
    }

    result.push({
      label: `${hourStart.getHours()}:00`,
      count: hourBookings.length,
      statusBreakdown,
    })
  }

  return result
}

function groupBookingsByDay(bookings, fromDate, toDate) {
  const result = []
  const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  for (let i = 0; i < days; i++) {
    const date = new Date(fromDate)
    date.setDate(date.getDate() + i)

    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const dayBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= dayStart && bookingDate <= dayEnd
    })

    const statusBreakdown = {
      pending: dayBookings.filter((b) => b.status === "pending").length,
      confirmed: dayBookings.filter((b) => b.status === "confirmed").length,
      approved: dayBookings.filter((b) => b.status === "approved").length,
      cancelled: dayBookings.filter((b) => b.status === "cancelled").length,
      completed: dayBookings.filter((b) => b.status === "completed").length,
    }

    result.push({
      label: `${dayStart.getMonth() + 1}/${dayStart.getDate()}`,
      count: dayBookings.length,
      statusBreakdown,
    })
  }

  return result
}

function groupBookingsByMonth(bookings, fromDate, toDate) {
  const result = []
  const months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + toDate.getMonth() - fromDate.getMonth() + 1

  for (let i = 0; i < months; i++) {
    const date = new Date(fromDate)
    date.setMonth(date.getMonth() + i)

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

    const monthBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= monthStart && bookingDate <= monthEnd
    })

    const statusBreakdown = {
      pending: monthBookings.filter((b) => b.status === "pending").length,
      confirmed: monthBookings.filter((b) => b.status === "confirmed").length,
      approved: monthBookings.filter((b) => b.status === "approved").length,
      cancelled: monthBookings.filter((b) => b.status === "cancelled").length,
      completed: monthBookings.filter((b) => b.status === "completed").length,
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    result.push({
      label: `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`,
      count: monthBookings.length,
      statusBreakdown,
    })
  }

  return result
}

