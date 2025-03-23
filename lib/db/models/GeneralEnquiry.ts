import mongoose, { Schema, type Document } from "mongoose"

export interface IGeneralEnquiry extends Document {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const GeneralEnquirySchema = new Schema<IGeneralEnquiry>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    phone: { type: String, required: [true, "Phone is required"] },
    subject: { type: String, required: [true, "Subject is required"] },
    message: { type: String, required: [true, "Message is required"] },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
const GeneralEnquiry =
  mongoose.models.GeneralEnquiry || mongoose.model<IGeneralEnquiry>("GeneralEnquiry", GeneralEnquirySchema)

export default GeneralEnquiry

