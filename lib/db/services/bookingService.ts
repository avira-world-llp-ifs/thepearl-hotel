import { dbConnect } from "../dbConnect"
import Booking from "../models/Booking"

export const bookingService = {
  getAll: async () => {
    try {
      await dbConnect()
      const bookings = await Booking.find({}).lean()
      console.log(`Retrieved ${bookings.length} bookings from database`)
      return bookings
    } catch (error) {
      console.error("Error in bookingService.getAll:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const booking = await Booking.findById(id).lean()
      if (!booking) {
        console.log(`Booking with ID ${id} not found`)
      } else {
        console.log(`Retrieved booking with ID ${id}`)
      }
      return booking
    } catch (error) {
      console.error(`Error in bookingService.getById for ID ${id}:`, error)
      throw error
    }
  },
  getByUserId: async (userId: string) => {
    try {
      await dbConnect()
      const bookings = await Booking.find({ userId }).lean()
      console.log(`Retrieved ${bookings.length} bookings for user ${userId}`)
      return bookings
    } catch (error) {
      console.error(`Error in bookingService.getByUserId for user ${userId}:`, error)
      throw error
    }
  },
  getOverlappingBookings: async (roomId: string, checkIn: Date, checkOut: Date) => {
    try {
      await dbConnect()
      console.log(`Checking for overlapping bookings for room ${roomId} from ${checkIn} to ${checkOut}`)

      const overlappingBookings = await Booking.find({
        roomId,
        status: { $ne: "cancelled" },
        $or: [
          { checkIn: { $gte: checkIn, $lt: checkOut } },
          { checkOut: { $gt: checkIn, $lte: checkOut } },
          {
            $and: [{ checkIn: { $lte: checkIn } }, { checkOut: { $gte: checkOut } }],
          },
        ],
      }).lean()

      console.log(`Found ${overlappingBookings.length} overlapping bookings`)
      return overlappingBookings
    } catch (error) {
      console.error("Error in bookingService.getOverlappingBookings:", error)
      throw error
    }
  },
  getCount: async () => {
    try {
      await dbConnect()
      const count = await Booking.countDocuments()
      console.log(`Total booking count: ${count}`)
      return count
    } catch (error) {
      console.error("Error in bookingService.getCount:", error)
      throw error
    }
  },
  getCountForYear: async (year: number) => {
    try {
      await dbConnect()
      // Create date range for the specified year
      const startDate = new Date(year, 0, 1) // January 1st of the year
      const endDate = new Date(year + 1, 0, 1) // January 1st of the next year

      const count = await Booking.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      })

      console.log(`Booking count for year ${year}: ${count}`)
      return count
    } catch (error) {
      console.error(`Error in bookingService.getCountForYear for year ${year}:`, error)
      throw error
    }
  },

  generateBookingId: async () => {
    try {
      const currentYear = new Date().getFullYear()
      const count = await bookingService.getCountForYear(currentYear)
      // Start from 1 and increment (count + 1)
      const nextNumber = count + 1
      // Format with leading zeros to ensure 4 digits
      const formattedNumber = nextNumber.toString().padStart(4, "0")
      const bookingId = `INV_${currentYear}_${formattedNumber}`

      console.log(`Generated new booking ID: ${bookingId}`)
      return bookingId
    } catch (error) {
      console.error("Error in bookingService.generateBookingId:", error)
      throw error
    }
  },
  create: async (booking: any) => {
    try {
      await dbConnect()
      console.log("Creating booking with data:", booking)

      // Validate required fields
      if (!booking.userId) throw new Error("User ID is required")
      if (!booking.roomId) throw new Error("Room ID is required")
      if (!booking.checkIn) throw new Error("Check-in date is required")
      if (!booking.checkOut) throw new Error("Check-out date is required")
      if (booking.guests === undefined || booking.guests === null) throw new Error("Number of guests is required")
      if (booking.totalPrice === undefined || booking.totalPrice === null) throw new Error("Total price is required")

      // Generate booking ID if not provided
      if (!booking.bookingId) {
        booking.bookingId = await bookingService.generateBookingId()
      }

      const newBooking = await Booking.create(booking)
      console.log("Booking created successfully:", newBooking)
      return newBooking
    } catch (error) {
      console.error("Error in bookingService.create:", error)
      throw error
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating booking with ID ${id} with data:`, data)
      const updatedBooking = await Booking.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedBooking) {
        console.log(`Booking with ID ${id} not found for update`)
      } else {
        console.log(`Booking with ID ${id} updated successfully`)
      }
      return updatedBooking
    } catch (error) {
      console.error(`Error in bookingService.update for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting booking with ID ${id}`)
      const deletedBooking = await Booking.findByIdAndDelete(id).lean()
      if (!deletedBooking) {
        console.log(`Booking with ID ${id} not found for deletion`)
      } else {
        console.log(`Booking with ID ${id} deleted successfully`)
      }
      return deletedBooking
    } catch (error) {
      console.error(`Error in bookingService.delete for ID ${id}:`, error)
      throw error
    }
  },
}

