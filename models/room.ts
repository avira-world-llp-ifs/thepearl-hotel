import mongoose from "mongoose"

// Define the Room interface
export interface IRoom {
  roomNumber: string
  name: string
  roomType: string
  price: number // Add this field
  pricePerNight: number // Keep this field for compatibility
  capacity: number
  amenities: string[]
  description: string
  images: string[]
  status: "available" | "occupied" | "maintenance"
  floor: number
  createdAt: Date
  updatedAt: Date
}

// Define the Room schema
const RoomSchema = new mongoose.Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, "Room type is required"],
      enum: ["standard", "deluxe", "suite", "executive", "presidential"],
      default: "standard",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    pricePerNight: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    capacity: {
      type: Number,
      required: [true, "Room capacity is required"],
      min: [1, "Capacity must be at least 1"],
      default: 2,
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    floor: {
      type: Number,
      required: [true, "Floor number is required"],
      min: [0, "Floor number cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model already exists to prevent overwrite errors
const Room = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema)

export default Room

