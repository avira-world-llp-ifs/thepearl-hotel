import { dbConnect } from "../dbConnect"
import Enquiry, { type IEnquiry } from "../models/Enquiry"

export const enquiryService = {
  create: async (enquiry: Omit<IEnquiry, "createdAt" | "updatedAt" | "isRead" | "status">): Promise<IEnquiry> => {
    try {
      await dbConnect()
      const newEnquiry = new Enquiry(enquiry)
      await newEnquiry.save()
      return newEnquiry
    } catch (error) {
      console.error("Error creating enquiry:", error)
      throw error
    }
  },
  getById: async (id: string): Promise<IEnquiry | null> => {
    try {
      await dbConnect()
      const enquiry = await Enquiry.findById(id).lean()
      return enquiry
    } catch (error) {
      console.error(`Error getting enquiry by id ${id}:`, error)
      throw error
    }
  },
  getAll: async (): Promise<IEnquiry[]> => {
    try {
      await dbConnect()
      const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean()
      return enquiries
    } catch (error) {
      console.error("Error getting all enquiries:", error)
      throw error
    }
  },
  update: async (id: string, data: Partial<IEnquiry>): Promise<IEnquiry | null> => {
    try {
      await dbConnect()
      const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, data, { new: true }).lean()
      return updatedEnquiry
    } catch (error) {
      console.error(`Error updating enquiry with id ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string): Promise<IEnquiry | null> => {
    try {
      await dbConnect()
      const deletedEnquiry = await Enquiry.findByIdAndDelete(id).lean()
      return deletedEnquiry
    } catch (error) {
      console.error(`Error deleting enquiry with id ${id}:`, error)
      throw error
    }
  },
}

