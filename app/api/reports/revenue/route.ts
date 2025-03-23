import { type NextRequest, NextResponse } from "next/server"
import { bookingService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

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

    // Group bookings by period
    let groupedData = []

    switch (period) {
      case "today":
        // Group by hour
        groupedData = groupRevenueByHour(filteredBookings, fromDate || new Date(), toDate)
        break
      case "week":
        // Group by day
        groupedData = groupRevenueByDay(
          filteredBookings,
          fromDate || new Date(new Date().setDate(new Date().getDate() - 7)),
          toDate,
        )
        break
      case "month":
        // Group by day
        groupedData = groupRevenueByDay(filteredBookings, fromDate || new Date(new Date().setDate(1)), toDate)
        break
      case "year":
        // Group by month
        groupedData = groupRevenueByMonth(filteredBookings, fromDate || new Date(new Date().setMonth(0)), toDate)
        break
      case "custom":
        // Determine grouping based on date range
        const daysDiff = Math.ceil((toDate.getTime() - (fromDate?.getTime() || 0)) / (1000 * 60 * 60 * 24))

        if (daysDiff <= 1) {
          groupedData = groupRevenueByHour(filteredBookings, fromDate || toDate, toDate)
        } else if (daysDiff <= 31) {
          groupedData = groupRevenueByDay(filteredBookings, fromDate || toDate, toDate)
        } else {
          groupedData = groupRevenueByMonth(filteredBookings, fromDate || toDate, toDate)
        }
        break
    }

    // Calculate total revenue
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    return NextResponse.json({
      data: groupedData,
      totalRevenue,
    })
  } catch (error) {
    console.error("Error fetching revenue reports:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch revenue reports" }, { status: 500 })
  }
}

// Helper functions for grouping revenue
function groupRevenueByHour(bookings, fromDate, toDate) {
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

    const hourRevenue = hourBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    result.push({
      label: `${hourStart.getHours()}:00`,
      revenue: hourRevenue,
      bookingCount: hourBookings.length,
    })
  }

  return result
}

function groupRevenueByDay(bookings, fromDate, toDate) {
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

    const dayRevenue = dayBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    result.push({
      label: `${dayStart.getMonth() + 1}/${dayStart.getDate()}`,
      revenue: dayRevenue,
      bookingCount: dayBookings.length,
    })
  }

  return result
}

function groupRevenueByMonth(bookings, fromDate, toDate) {
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

    const monthRevenue = monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    result.push({
      label: `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`,
      revenue: monthRevenue,
      bookingCount: monthBookings.length,
    })
  }

  return result
}

