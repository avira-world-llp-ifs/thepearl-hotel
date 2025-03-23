import mongoose, { Schema, type Document } from "mongoose"

export interface IBooking extends Document {
  userId: string
  roomId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "pending" | "paid" | "refunded"
  paymentId?: string
  specialRequests?: string
  bookingId?: string // Add this field if it doesn't exist
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: [true, "User ID is required"] },
    roomId: { type: String, required: [true, "Room ID is required"] },
    checkIn: { type: Date, required: [true, "Check-in date is required"] },
    checkOut: { type: Date, required: [true, "Check-out date is required"] },
    guests: { type: Number, required: [true, "Number of guests is required"] },
    totalPrice: { type: Number, required: [true, "Total price is required"] },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentId: { type: String },
    specialRequests: { type: String },
    bookingId: { type: String }, // Add this field if it doesn't exist
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)

export default Booking

