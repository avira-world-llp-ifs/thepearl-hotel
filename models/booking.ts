import mongoose, { Schema, models, model } from "mongoose"

const bookingSchema = new Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  // Using the field names from the database
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    default: 1,
  },
  numberOfNights: {
    type: Number,
    required: true,
    default: 1,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "amount"],
    default: "percentage",
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  specialRequests: {
    type: String,
    default: "",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
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

const Booking = models.Booking || model("Booking", bookingSchema)

export default Booking

