import { dbConnect } from "../dbConnect"
import GeneralEnquiry, { type IGeneralEnquiry } from "../models/GeneralEnquiry"

export const generalEnquiryService = {
  create: async (enquiry: Omit<IGeneralEnquiry, "createdAt" | "updatedAt" | "isRead">): Promise<IGeneralEnquiry> => {
    try {
      await dbConnect()
      const newEnquiry = new GeneralEnquiry({
        ...enquiry,
        isRead: false,
      })
      await newEnquiry.save()
      return newEnquiry
    } catch (error) {
      console.error("Error creating general enquiry:", error)
      throw error
    }
  },

  getById: async (id: string): Promise<IGeneralEnquiry | null> => {
    try {
      await dbConnect()
      const enquiry = await GeneralEnquiry.findById(id).lean()
      return enquiry
    } catch (error) {
      console.error(`Error getting general enquiry by id ${id}:`, error)
      throw error
    }
  },

  getAll: async (): Promise<IGeneralEnquiry[]> => {
    try {
      await dbConnect()
      const enquiries = await GeneralEnquiry.find({}).sort({ createdAt: -1 }).lean()
      return enquiries
    } catch (error) {
      console.error("Error getting all general enquiries:", error)
      throw error
    }
  },

  getUnread: async (): Promise<IGeneralEnquiry[]> => {
    try {
      await dbConnect()
      const enquiries = await GeneralEnquiry.find({ isRead: false }).sort({ createdAt: -1 }).lean()
      return enquiries
    } catch (error) {
      console.error("Error getting unread general enquiries:", error)
      throw error
    }
  },

  getRead: async (): Promise<IGeneralEnquiry[]> => {
    try {
      await dbConnect()
      const enquiries = await GeneralEnquiry.find({ isRead: true }).sort({ createdAt: -1 }).lean()
      return enquiries
    } catch (error) {
      console.error("Error getting read general enquiries:", error)
      throw error
    }
  },

  update: async (id: string, data: Partial<IGeneralEnquiry>): Promise<IGeneralEnquiry | null> => {
    try {
      await dbConnect()
      const updatedEnquiry = await GeneralEnquiry.findByIdAndUpdate(id, data, { new: true }).lean()
      return updatedEnquiry
    } catch (error) {
      console.error(`Error updating general enquiry with id ${id}:`, error)
      throw error
    }
  },

  delete: async (id: string): Promise<IGeneralEnquiry | null> => {
    try {
      await dbConnect()
      const deletedEnquiry = await GeneralEnquiry.findByIdAndDelete(id).lean()
      return deletedEnquiry
    } catch (error) {
      console.error(`Error deleting general enquiry with id ${id}:`, error)
      throw error
    }
  },
}

