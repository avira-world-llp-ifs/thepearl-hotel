import { type NextRequest, NextResponse } from "next/server"
import { bookingService, roomService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "month"
    const roomType = searchParams.get("roomType") || "all"
    const fromDate = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined
    const toDate = searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date()

    // Get all rooms and bookings
    const rooms = await roomService.getAll()
    const bookings = await bookingService.getAll()

    // Filter bookings by date range and only include active bookings
    const filteredBookings = bookings.filter((booking) => {
      const checkInDate = new Date(booking.checkIn)
      const checkOutDate = new Date(booking.checkOut)

      // Only include confirmed, approved, or completed bookings
      if (!["confirmed", "approved", "completed"].includes(booking.status)) {
        return false
      }

      // Check if booking overlaps with the date range
      return (
        (checkInDate <= toDate && checkOutDate >= fromDate) ||
        (checkInDate >= fromDate && checkInDate <= toDate) ||
        (checkOutDate >= fromDate && checkOutDate <= toDate)
      )
    })

    // Filter rooms by type if specified
    const filteredRooms =
      roomType !== "all" ? rooms.filter((room) => room.name.toLowerCase().includes(roomType.toLowerCase())) : rooms

    // Group occupancy by period
    let groupedData = []

    switch (period) {
      case "today":
        // Group by hour
        groupedData = calculateOccupancyByHour(filteredRooms, filteredBookings, fromDate || new Date(), toDate)
        break
      case "week":
        // Group by day
        groupedData = calculateOccupancyByDay(
          filteredRooms,
          filteredBookings,
          fromDate || new Date(new Date().setDate(new Date().getDate() - 7)),
          toDate,
        )
        break
      case "month":
        // Group by day
        groupedData = calculateOccupancyByDay(
          filteredRooms,
          filteredBookings,
          fromDate || new Date(new Date().setDate(1)),
          toDate,
        )
        break
      case "year":
        // Group by month
        groupedData = calculateOccupancyByMonth(
          filteredRooms,
          filteredBookings,
          fromDate || new Date(new Date().setMonth(0)),
          toDate,
        )
        break
      case "custom":
        // Determine grouping based on date range
        const daysDiff = Math.ceil((toDate.getTime() - (fromDate?.getTime() || 0)) / (1000 * 60 * 60 * 24))

        if (daysDiff <= 1) {
          groupedData = calculateOccupancyByHour(filteredRooms, filteredBookings, fromDate || toDate, toDate)
        } else if (daysDiff <= 31) {
          groupedData = calculateOccupancyByDay(filteredRooms, filteredBookings, fromDate || toDate, toDate)
        } else {
          groupedData = calculateOccupancyByMonth(filteredRooms, filteredBookings, fromDate || toDate, toDate)
        }
        break
    }

    // Calculate average occupancy
    const averageOccupancy =
      groupedData.length > 0
        ? Math.round(groupedData.reduce((sum, item) => sum + item.occupancyRate, 0) / groupedData.length)
        : 0

    return NextResponse.json({
      data: groupedData,
      averageOccupancy,
    })
  } catch (error) {
    console.error("Error fetching occupancy reports:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch occupancy reports" }, { status: 500 })
  }
}

// Helper functions for calculating occupancy
function calculateOccupancyByHour(rooms, bookings, fromDate, toDate) {
  const result = []
  const hours = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60)) + 1
  const totalRooms = rooms.length

  // Categorize rooms by type
  const roomsByType = {
    standard: rooms.filter((room) => room.name.toLowerCase().includes("standard")).length,
    deluxe: rooms.filter((room) => room.name.toLowerCase().includes("deluxe")).length,
    executive: rooms.filter((room) => room.name.toLowerCase().includes("executive")).length,
    family: rooms.filter((room) => room.name.toLowerCase().includes("family")).length,
  }

  for (let i = 0; i < hours; i++) {
    const date = new Date(fromDate)
    date.setHours(date.getHours() + i)

    const hourStart = new Date(date)
    hourStart.setMinutes(0, 0, 0)

    const hourEnd = new Date(date)
    hourEnd.setMinutes(59, 59, 999)

    // Count occupied rooms during this hour
    const occupiedRoomIds = new Set()

    bookings.forEach((booking) => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)

      if (checkIn <= hourEnd && checkOut >= hourStart) {
        occupiedRoomIds.add(booking.roomId.toString())
      }
    })

    const occupiedRooms = occupiedRoomIds.size
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    // Calculate occupancy by room type
    const roomTypeBreakdown = {
      standard: Math.min(occupiedRooms * (roomsByType.standard / totalRooms), roomsByType.standard),
      deluxe: Math.min(occupiedRooms * (roomsByType.deluxe / totalRooms), roomsByType.deluxe),
      executive: Math.min(occupiedRooms * (roomsByType.executive / totalRooms), roomsByType.executive),
      family: Math.min(occupiedRooms * (roomsByType.family / totalRooms), roomsByType.family),
    }

    result.push({
      label: `${hourStart.getHours()}:00`,
      occupiedRooms,
      totalRooms,
      occupancyRate,
      roomTypeBreakdown,
    })
  }

  return result
}

function calculateOccupancyByDay(rooms, bookings, fromDate, toDate) {
  const result = []
  const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const totalRooms = rooms.length

  // Categorize rooms by type
  const roomsByType = {
    standard: rooms.filter((room) => room.name.toLowerCase().includes("standard")).length,
    deluxe: rooms.filter((room) => room.name.toLowerCase().includes("deluxe")).length,
    executive: rooms.filter((room) => room.name.toLowerCase().includes("executive")).length,
    family: rooms.filter((room) => room.name.toLowerCase().includes("family")).length,
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(fromDate)
    date.setDate(date.getDate() + i)

    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    // Count occupied rooms during this day
    const occupiedRoomIds = new Set()

    bookings.forEach((booking) => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)

      if (checkIn <= dayEnd && checkOut >= dayStart) {
        occupiedRoomIds.add(booking.roomId.toString())
      }
    })

    const occupiedRooms = occupiedRoomIds.size
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    // Calculate occupancy by room type
    const roomTypeBreakdown = {
      standard: Math.min(occupiedRooms * (roomsByType.standard / totalRooms), roomsByType.standard),
      deluxe: Math.min(occupiedRooms * (roomsByType.deluxe / totalRooms), roomsByType.deluxe),
      executive: Math.min(occupiedRooms * (roomsByType.executive / totalRooms), roomsByType.executive),
      family: Math.min(occupiedRooms * (roomsByType.family / totalRooms), roomsByType.family),
    }

    result.push({
      label: `${dayStart.getMonth() + 1}/${dayStart.getDate()}`,
      occupiedRooms,
      totalRooms,
      occupancyRate,
      roomTypeBreakdown,
    })
  }

  return result
}

function calculateOccupancyByMonth(rooms, bookings, fromDate, toDate) {
  const result = []
  const months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + toDate.getMonth() - fromDate.getMonth() + 1
  const totalRooms = rooms.length

  // Categorize rooms by type
  const roomsByType = {
    standard: rooms.filter((room) => room.name.toLowerCase().includes("standard")).length,
    deluxe: rooms.filter((room) => room.name.toLowerCase().includes("deluxe")).length,
    executive: rooms.filter((room) => room.name.toLowerCase().includes("executive")).length,
    family: rooms.filter((room) => room.name.toLowerCase().includes("family")).length,
  }

  for (let i = 0; i < months; i++) {
    const date = new Date(fromDate)
    date.setMonth(date.getMonth() + i)

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

    // Count occupied rooms during this month
    const occupiedRoomIds = new Set()

    bookings.forEach((booking) => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)

      if (checkIn <= monthEnd && checkOut >= monthStart) {
        occupiedRoomIds.add(booking.roomId.toString())
      }
    })

    const occupiedRooms = occupiedRoomIds.size
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    // Calculate occupancy by room type
    const roomTypeBreakdown = {
      standard: Math.min(occupiedRooms * (roomsByType.standard / totalRooms), roomsByType.standard),
      deluxe: Math.min(occupiedRooms * (roomsByType.deluxe / totalRooms), roomsByType.deluxe),
      executive: Math.min(occupiedRooms * (roomsByType.executive / totalRooms), roomsByType.executive),
      family: Math.min(occupiedRooms * (roomsByType.family / totalRooms), roomsByType.family),
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    result.push({
      label: `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`,
      occupiedRooms,
      totalRooms,
      occupancyRate,
      roomTypeBreakdown,
    })
  }

  return result
}

