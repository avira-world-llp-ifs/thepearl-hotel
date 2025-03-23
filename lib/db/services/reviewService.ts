import { dbConnect } from "../dbConnect"
import Review from "../models/Review"

export const reviewService = {
  getAll: async () => {
    try {
      await dbConnect()
      const reviews = await Review.find({}).lean()
      console.log(`Retrieved ${reviews.length} reviews from database`)
      return reviews
    } catch (error) {
      console.error("Error in reviewService.getAll:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const review = await Review.findById(id).lean()
      if (!review) {
        console.log(`Review with ID ${id} not found`)
      } else {
        console.log(`Retrieved review with ID ${id}`)
      }
      return review
    } catch (error) {
      console.error(`Error in reviewService.getById for ID ${id}:`, error)
      throw error
    }
  },
  getByRoomId: async (roomId: string) => {
    try {
      await dbConnect()
      const reviews = await Review.find({ roomId }).lean()
      console.log(`Retrieved ${reviews.length} reviews for room ${roomId}`)
      return reviews
    } catch (error) {
      console.error(`Error in reviewService.getByRoomId for room ${roomId}:`, error)
      throw error
    }
  },
  getByUserId: async (userId: string) => {
    try {
      await dbConnect()
      const reviews = await Review.find({ userId }).lean()
      console.log(`Retrieved ${reviews.length} reviews for user ${userId}`)
      return reviews
    } catch (error) {
      console.error(`Error in reviewService.getByUserId for user ${userId}:`, error)
      throw error
    }
  },
  create: async (review: any) => {
    try {
      await dbConnect()
      console.log("Creating review with data:", review)

      // Validate required fields
      if (!review.userId) throw new Error("User ID is required")
      if (!review.roomId) throw new Error("Room ID is required")
      if (review.rating === undefined || review.rating === null) throw new Error("Rating is required")
      if (!review.comment) throw new Error("Comment is required")

      const newReview = await Review.create(review)
      console.log("Review created successfully:", newReview)
      return newReview
    } catch (error) {
      console.error("Error in reviewService.create:", error)
      throw error
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating review with ID ${id} with data:`, data)
      const updatedReview = await Review.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedReview) {
        console.log(`Review with ID ${id} not found for update`)
      } else {
        console.log(`Review with ID ${id} updated successfully`)
      }
      return updatedReview
    } catch (error) {
      console.error(`Error in reviewService.update for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting review with ID ${id}`)
      const deletedReview = await Review.findByIdAndDelete(id).lean()
      if (!deletedReview) {
        console.log(`Review with ID ${id} not found for deletion`)
      } else {
        console.log(`Review with ID ${id} deleted successfully`)
      }
      return deletedReview
    } catch (error) {
      console.error(`Error in reviewService.delete for ID ${id}:`, error)
      throw error
    }
  },
}

