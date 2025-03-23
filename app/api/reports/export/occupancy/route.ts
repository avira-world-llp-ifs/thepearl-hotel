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

    // Filter rooms by type if specified
    const filteredRooms =
      roomType !== "all" ? rooms.filter((room) => room.name.toLowerCase().includes(roomType.toLowerCase())) : rooms

    // Generate date range based on period
    const dateRange: Date[] = []

    switch (period) {
      case "today":
        // Hours in the day
        for (let i = 0; i < 24; i++) {
          const date = new Date(toDate)
          date.setHours(i, 0, 0, 0)
          dateRange.push(date)
        }
        break
      case "week":
        // Days in the week
        for (let i = 0; i < 7; i++) {
          const date = new Date(toDate)
          date.setDate(date.getDate() - 6 + i)
          date.setHours(0, 0, 0, 0)
          dateRange.push(date)
        }
        break
      case "month":
        // Days in the month
        const daysInMonth = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0).getDate()
        for (let i = 0; i < daysInMonth; i++) {
          const date = new Date(toDate.getFullYear(), toDate.getMonth(), i + 1)
          dateRange.push(date)
        }
        break
      case "year":
        // Months in the year
        for (let i = 0; i < 12; i++) {
          const date = new Date(toDate.getFullYear(), i, 1)
          dateRange.push(date)
        }
        break
      case "custom":
        // Days in the custom range
        if (fromDate && toDate) {
          const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
          for (let i = 0; i <= daysDiff; i++) {
            const date = new Date(fromDate)
            date.setDate(date.getDate() + i)
            date.setHours(0, 0, 0, 0)
            dateRange.push(date)
          }
        }
        break
    }

    // Generate CSV content
    let csvContent =
      "Date,Total Rooms,Occupied Rooms,Occupancy Rate (%),Standard Rooms Occupied,Deluxe Rooms Occupied,Executive Suites Occupied,Family Rooms Occupied\n"

    for (const date of dateRange) {
      const dateStart = new Date(date)
      let dateEnd: Date

      if (period === "today") {
        // For hourly data
        dateStart.setMinutes(0, 0, 0)
        dateEnd = new Date(dateStart)
        dateEnd.setMinutes(59, 59, 999)
      } else if (period === "year") {
        // For monthly data
        dateEnd = new Date(dateStart.getFullYear(), dateStart.getMonth() + 1, 0, 23, 59, 59, 999)
      } else {
        // For daily data
        dateEnd = new Date(dateStart)
        dateEnd.setHours(23, 59, 59, 999)
      }

      // Count occupied rooms for this date
      const occupiedRoomIds = new Set()

      bookings.forEach((booking) => {
        const checkIn = new Date(booking.checkIn)
        const checkOut = new Date(booking.checkOut)

        if (
          checkIn <= dateEnd &&
          checkOut >= dateStart &&
          ["confirmed", "approved", "completed"].includes(booking.status)
        ) {
          occupiedRoomIds.add(booking.roomId.toString())
        }
      })

      const totalRooms = filteredRooms.length
      const occupiedRooms = occupiedRoomIds.size
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

      // Count occupied rooms by type
      const standardRooms = filteredRooms.filter((room) => room.name.toLowerCase().includes("standard"))
      const deluxeRooms = filteredRooms.filter((room) => room.name.toLowerCase().includes("deluxe"))
      const executiveRooms = filteredRooms.filter((room) => room.name.toLowerCase().includes("executive"))
      const familyRooms = filteredRooms.filter((room) => room.name.toLowerCase().includes("family"))

      const occupiedStandardRooms = standardRooms.filter((room) => occupiedRoomIds.has(room._id.toString())).length

      const occupiedDeluxeRooms = deluxeRooms.filter((room) => occupiedRoomIds.has(room._id.toString())).length

      const occupiedExecutiveRooms = executiveRooms.filter((room) => occupiedRoomIds.has(room._id.toString())).length

      const occupiedFamilyRooms = familyRooms.filter((room) => occupiedRoomIds.has(room._id.toString())).length

      // Format date label based on period
      let dateLabel: string
      if (period === "today") {
        dateLabel = `${dateStart.toLocaleDateString()} ${dateStart.getHours()}:00`
      } else if (period === "year") {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
        dateLabel = `${monthNames[dateStart.getMonth()]} ${dateStart.getFullYear()}`
      } else {
        dateLabel = dateStart.toLocaleDateString()
      }

      csvContent +=
        [
          dateLabel,
          totalRooms,
          occupiedRooms,
          occupancyRate,
          occupiedStandardRooms,
          occupiedDeluxeRooms,
          occupiedExecutiveRooms,
          occupiedFamilyRooms,
        ]
          .map((value) => `"${value}"`)
          .join(",") + "\n"
    }

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="occupancy-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting occupancy report:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to export occupancy report" }, { status: 500 })
  }
}

