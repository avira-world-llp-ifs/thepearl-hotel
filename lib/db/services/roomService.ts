import { dbConnect } from "../dbConnect"
import Room from "../models/Room"
import Booking from "../models/Booking"

export const roomService = {
  getAll: async () => {
    try {
      await dbConnect()
      const rooms = await Room.find({}).lean()
      console.log(`Retrieved ${rooms.length} rooms from database`)
      return rooms
    } catch (error) {
      console.error("Error in roomService.getAll:", error)
      throw error
    }
  },
  getFeatured: async () => {
    try {
      await dbConnect()
      const featuredRooms = await Room.find({ featured: true }).lean()
      console.log(`Retrieved ${featuredRooms.length} featured rooms from database`)
      return featuredRooms
    } catch (error) {
      console.error("Error in roomService.getFeatured:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const room = await Room.findById(id).lean()
      if (!room) {
        console.log(`Room with ID ${id} not found`)
      } else {
        console.log(`Retrieved room with ID ${id}`)
      }
      return room
    } catch (error) {
      console.error(`Error in roomService.getById for ID ${id}:`, error)
      throw error
    }
  },
  create: async (room: any) => {
    try {
      await dbConnect()
      console.log("Creating room with data:", JSON.stringify(room, null, 2))

      // Validate required fields
      if (!room.name) throw new Error("Room name is required")
      if (!room.description) throw new Error("Room description is required")
      if (room.price === undefined || room.price === null) throw new Error("Room price is required")
      if (room.capacity === undefined || room.capacity === null) throw new Error("Room capacity is required")
      if (room.size === undefined || room.size === null) throw new Error("Room size is required")

      // Ensure numeric values are numbers
      const roomData = {
        ...room,
        price: typeof room.price === "number" ? room.price : Number(room.price),
        capacity: typeof room.capacity === "number" ? room.capacity : Number(room.capacity),
        size: typeof room.size === "number" ? room.size : Number(room.size),
        categoryId: room.categoryId || undefined, // Handle categoryId
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        images: Array.isArray(room.images) ? room.images : [],
        featured: Boolean(room.featured),
      }

      console.log("Sanitized room data:", JSON.stringify(roomData, null, 2))

      const newRoom = await Room.create(roomData)
      console.log("Room created successfully:", newRoom)
      return newRoom
    } catch (error) {
      console.error("Error in roomService.create:", error)
      // Check for MongoDB validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message)
        throw new Error(`Validation error: ${validationErrors.join(", ")}`)
      }
      throw error // Re-throw to handle in the API route
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating room with ID ${id} with data:`, data)
      const updatedRoom = await Room.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedRoom) {
        console.log(`Room with ID ${id} not found for update`)
      } else {
        console.log(`Room with ID ${id} updated successfully`)
      }
      return updatedRoom
    } catch (error) {
      console.error(`Error in roomService.update for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting room with ID ${id}`)
      const deletedRoom = await Room.findByIdAndDelete(id).lean()
      if (!deletedRoom) {
        console.log(`Room with ID ${id} not found for deletion`)
      } else {
        console.log(`Room with ID ${id} deleted successfully`)
      }
      return deletedRoom
    } catch (error) {
      console.error(`Error in roomService.delete for ID ${id}:`, error)
      throw error
    }
  },
  getAvailable: async (checkIn: Date, checkOut: Date, guests: number) => {
    try {
      await dbConnect()
      console.log(`Finding available rooms for dates ${checkIn} to ${checkOut} for ${guests} guests`)

      // Get all bookings that overlap with the requested dates
      const overlappingBookings = await Booking.find({
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

      // Get the IDs of rooms that are booked during the requested dates
      const bookedRoomIds = overlappingBookings.map((booking) => booking.roomId)

      // Return rooms that are not booked and have enough capacity
      const availableRooms = await Room.find({
        _id: { $nin: bookedRoomIds },
        capacity: { $gte: guests },
      }).lean()

      console.log(`Found ${availableRooms.length} available rooms`)
      return availableRooms
    } catch (error) {
      console.error("Error in roomService.getAvailable:", error)
      throw error
    }
  },
  getByCategoryId: async (categoryId: string) => {
    try {
      await dbConnect()
      const rooms = await Room.find({ categoryId }).lean()
      console.log(`Retrieved ${rooms.length} rooms for category ${categoryId}`)
      return rooms
    } catch (error) {
      console.error(`Error in roomService.getByCategoryId for category ${categoryId}:`, error)
      throw error
    }
  },
}

