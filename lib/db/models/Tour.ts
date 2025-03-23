import mongoose, { Schema, type Document } from "mongoose"

export interface ITour extends Document {
  title: string
  description: string
  duration: string
  price: number
  location: string
  images: string[]
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: {
    day: number
    title: string
    description: string
    accommodation: string
    meals: string[]
  }[]
  maxGroupSize: number
  difficulty: string
  startDates: Date[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    highlights: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        accommodation: { type: String },
        meals: [{ type: String }],
      },
    ],
    maxGroupSize: { type: Number, default: 15 },
    difficulty: { type: String, enum: ["easy", "medium", "difficult"], default: "medium" },
    startDates: [{ type: Date }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Tour || mongoose.model<ITour>("Tour", TourSchema)

