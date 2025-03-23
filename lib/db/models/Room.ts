import mongoose, { Schema, type Document } from "mongoose"

export interface IRoom extends Document {
  name: string
  description: string
  price: number
  capacity: number
  size: number
  featured: boolean
  images: string[]
  amenities: string[]
  categoryId?: string
  createdAt: Date
  updatedAt: Date
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: [true, "Room name is required"] },
    description: { type: String, required: [true, "Room description is required"] },
    price: { type: Number, required: [true, "Room price is required"] },
    capacity: { type: Number, required: [true, "Room capacity is required"] },
    size: { type: Number, required: [true, "Room size is required"] },
    featured: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    categoryId: { type: String },
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
const Room = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema)

export default Room

