import mongoose, { Schema, type Document } from "mongoose"

export interface IReview extends Document {
  userId: string
  roomId: string
  bookingId?: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: [true, "User ID is required"] },
    roomId: { type: String, required: [true, "Room ID is required"] },
    bookingId: { type: String },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: { type: String, required: [true, "Comment is required"] },
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)

export default Review

