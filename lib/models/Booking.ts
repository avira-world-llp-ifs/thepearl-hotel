import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Room ID is required"],
  },
  checkIn: {
    type: Date,
    required: [true, "Check-in date is required"],
  },
  checkOut: {
    type: Date,
    required: [true, "Check-out date is required"],
  },
  guests: {
    type: Number,
    required: [true, "Number of guests is required"],
    min: [1, "At least 1 guest is required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "approved", "cancelled", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field on save
BookingSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

