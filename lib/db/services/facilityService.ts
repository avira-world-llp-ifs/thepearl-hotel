import { dbConnect } from "../dbConnect"
import Facility from "../models/Facility"

export const facilityService = {
  getAll: async () => {
    try {
      await dbConnect()
      const facilities = await Facility.find({}).lean()
      console.log(`Retrieved ${facilities.length} facilities from database`)
      return facilities
    } catch (error) {
      console.error("Error in facilityService.getAll:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const facility = await Facility.findById(id).lean()
      if (!facility) {
        console.log(`Facility with ID ${id} not found`)
      } else {
        console.log(`Retrieved facility with ID ${id}`)
      }
      return facility
    } catch (error) {
      console.error(`Error in facilityService.getById for ID ${id}:`, error)
      throw error
    }
  },
  create: async (facility: any) => {
    try {
      await dbConnect()
      console.log("Creating facility with data:", facility)

      // Validate required fields
      if (!facility.name) throw new Error("Facility name is required")

      const newFacility = await Facility.create(facility)
      console.log("Facility created successfully:", newFacility)
      return newFacility
    } catch (error) {
      console.error("Error in facilityService.create:", error)
      throw error
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating facility with ID ${id} with data:`, data)
      const updatedFacility = await Facility.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedFacility) {
        console.log(`Facility with ID ${id} not found for update`)
      } else {
        console.log(`Facility with ID ${id} updated successfully`)
      }
      return updatedFacility
    } catch (error) {
      console.error(`Error in facilityService.update for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting facility with ID ${id}`)
      const deletedFacility = await Facility.findByIdAndDelete(id).lean()
      if (!deletedFacility) {
        console.log(`Facility with ID ${id} not found for deletion`)
      } else {
        console.log(`Facility with ID ${id} deleted successfully`)
      }
      return deletedFacility
    } catch (error) {
      console.error(`Error in facilityService.delete for ID ${id}:`, error)
      throw error
    }
  },
}

