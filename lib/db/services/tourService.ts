import { dbConnect } from "../dbConnect"
import Tour from "../models/Tour"

export const tourService = {
  getAll: async () => {
    try {
      await dbConnect()
      const tours = await Tour.find({}).lean()
      console.log(`Retrieved ${tours.length} tours from database`)
      return tours
    } catch (error) {
      console.error("Error in tourService.getAll:", error)
      throw error
    }
  },
  getFeatured: async () => {
    try {
      await dbConnect()
      const featuredTours = await Tour.find({ featured: true }).lean()
      console.log(`Retrieved ${featuredTours.length} featured tours from database`)
      return featuredTours
    } catch (error) {
      console.error("Error in tourService.getFeatured:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const tour = await Tour.findById(id).lean()
      if (!tour) {
        console.log(`Tour with ID ${id} not found`)
      } else {
        console.log(`Retrieved tour with ID ${id}`)
      }
      return tour
    } catch (error) {
      console.error(`Error in tourService.getById for ID ${id}:`, error)
      throw error
    }
  },
  create: async (tour: any) => {
    try {
      await dbConnect()
      console.log("Creating tour with data:", tour)

      // Validate required fields
      if (!tour.name) throw new Error("Tour name is required")
      if (!tour.description) throw new Error("Tour description is required")
      if (tour.price === undefined || tour.price === null) throw new Error("Tour price is required")
      if (!tour.duration) throw new Error("Tour duration is required")

      const newTour = await Tour.create(tour)
      console.log("Tour created successfully:", newTour)
      return newTour
    } catch (error) {
      console.error("Error in tourService.create:", error)
      throw error
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating tour with ID ${id} with data:`, data)
      const updatedTour = await Tour.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedTour) {
        console.log(`Tour with ID ${id} not found for update`)
      } else {
        console.log(`Tour with ID ${id} updated successfully`)
      }
      return updatedTour
    } catch (error) {
      console.error(`Error in tourService.update for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting tour with ID ${id}`)
      const deletedTour = await Tour.findByIdAndDelete(id).lean()
      if (!deletedTour) {
        console.log(`Tour with ID ${id} not found for deletion`)
      } else {
        console.log(`Tour with ID ${id} deleted successfully`)
      }
      return deletedTour
    } catch (error) {
      console.error(`Error in tourService.delete for ID ${id}:`, error)
      throw error
    }
  },
}

