import mongoose, { Schema, type Document } from "mongoose"

export interface IEnquiry extends Document {
  name: string
  email: string
  phone?: string
  dateFrom?: Date
  dateTo?: Date
  numberOfMembers?: number
  roomType?: string
  message: string
  isRead: boolean
  status: "new" | "in-progress" | "resolved"
  createdAt: Date
  updatedAt: Date
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    phone: { type: String },
    dateFrom: { type: Date },
    dateTo: { type: Date },
    numberOfMembers: { type: Number },
    roomType: { type: String },
    message: { type: String, required: [true, "Message is required"] },
    isRead: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
const Enquiry = mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema)

export default Enquiry

