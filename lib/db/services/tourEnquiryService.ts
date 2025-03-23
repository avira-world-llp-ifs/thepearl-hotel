import { dbConnect } from "../dbConnect"
import TourEnquiry from "../models/TourEnquiry"

export const tourEnquiryService = {
  getAll: async () => {
    try {
      await dbConnect()
      const tourEnquiries = await TourEnquiry.find({}).sort({ createdAt: -1 }).lean()
      console.log(`Retrieved ${tourEnquiries.length} tour enquiries from database`)
      return tourEnquiries
    } catch (error) {
      console.error("Error in tourEnquiryService.getAll:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const tourEnquiry = await TourEnquiry.findById(id).lean()
      if (!tourEnquiry) {
        console.log(`Tour enquiry with ID ${id} not found`)
      } else {
        console.log(`Retrieved tour enquiry with ID ${id}`)
      }
      return tourEnquiry
    } catch (error) {
      console.error(`Error in tourEnquiryService.getById for ID ${id}:`, error)
      throw error
    }
  },
  getByTourId: async (tourId: string) => {
    try {
      await dbConnect()
      const tourEnquiries = await TourEnquiry.find({ tourId }).sort({ createdAt: -1 }).lean()
      console.log(`Retrieved ${tourEnquiries.length} enquiries for tour ${tourId}`)
      return tourEnquiries
    } catch (error) {
      console.error(`Error in tourEnquiryService.getByTourId for tour ${tourId}:`, error)
      throw error
    }
  },
  getUnread: async () => {
    try {
      await dbConnect()
      const unreadTourEnquiries = await TourEnquiry.find({ isRead: false }).sort({ createdAt: -1 }).lean()
      console.log(`Retrieved ${unreadTourEnquiries.length} unread tour enquiries from database`)
      return unreadTourEnquiries
    } catch (error) {
      console.error("Error in tourEnquiryService.getUnread:", error)
      throw error
    }
  },
  getRead: async () => {
    try {
      await dbConnect()
      const readTourEnquiries = await TourEnquiry.find({ isRead: true }).sort({ createdAt: -1 }).lean()
      console.log(`Retrieved ${readTourEnquiries.length} read tour enquiries from database`)
      return readTourEnquiries
    } catch (error) {
      console.error("Error in tourEnquiryService.getRead:", error)
      throw error
    }
  },
  create: async (tourEnquiry: any) => {
    try {
      await dbConnect()
      console.log("Creating tour enquiry with data:", tourEnquiry)

      // Validate required fields
      if (!tourEnquiry.name) throw new Error("Name is required")
      if (!tourEnquiry.email) throw new Error("Email is required")
      if (!tourEnquiry.message) throw new Error("Message is required")
      if (!tourEnquiry.tourId) throw new Error("Tour ID is required")

      const newTourEnquiry = await TourEnquiry.create(tourEnquiry)
      console.log("Tour enquiry created successfully:", newTourEnquiry)
      return newTourEnquiry
    } catch (error) {
      console.error("Error in tourEnquiryService.create:", error)
      throw error
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating tour enquiry with ID ${id} with data:`, data)
      const updatedTourEnquiry = await TourEnquiry.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedTourEnquiry) {
        console.log(`Tour enquiry with ID ${id} not found for update`)
      } else {
        console.log(`Tour enquiry with ID ${id} updated successfully`)
      }
      return updatedTourEnquiry
    } catch (error) {
      console.error(`Error in tourEnquiryService.update for ID ${id}:`, error)
      throw error
    }
  },
  markAsRead: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Marking tour enquiry with ID ${id} as read`)
      const updatedTourEnquiry = await TourEnquiry.findByIdAndUpdate(id, { isRead: true }, { new: true }).lean()
      if (!updatedTourEnquiry) {
        console.log(`Tour enquiry with ID ${id} not found for marking as read`)
      } else {
        console.log(`Tour enquiry with ID ${id} marked as read successfully`)
      }
      return updatedTourEnquiry
    } catch (error) {
      console.error(`Error in tourEnquiryService.markAsRead for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting tour enquiry with ID ${id}`)
      const deletedTourEnquiry = await TourEnquiry.findByIdAndDelete(id).lean()
      if (!deletedTourEnquiry) {
        console.log(`Tour enquiry with ID ${id} not found for deletion`)
      } else {
        console.log(`Tour enquiry with ID ${id} deleted successfully`)
      }
      return deletedTourEnquiry
    } catch (error) {
      console.error(`Error in tourEnquiryService.delete for ID ${id}:`, error)
      throw error
    }
  },
}

