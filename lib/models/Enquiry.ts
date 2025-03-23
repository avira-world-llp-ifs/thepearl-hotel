import mongoose from "mongoose"

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  dateFrom: {
    type: Date,
    required: [true, "Please provide a start date"],
  },
  dateTo: {
    type: Date,
    required: [true, "Please provide an end date"],
  },
  numberOfMembers: {
    type: Number,
    required: [true, "Please provide number of members"],
    min: [1, "At least 1 member is required"],
  },
  roomType: {
    type: String,
    required: [true, "Please provide a room type"],
  },
  message: {
    type: String,
    required: [true, "Please provide a message"],
  },
  isRead: {
    type: Boolean,
    default: false,
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
EnquirySchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema)

