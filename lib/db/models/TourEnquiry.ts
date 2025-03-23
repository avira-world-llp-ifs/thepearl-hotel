import mongoose, { Schema, type Document } from "mongoose"

export interface ITourEnquiry extends Document {
  tourId: mongoose.Types.ObjectId
  name: string
  email: string
  phone: string
  numberOfPeople: number
  preferredDate: Date
  message: string
  status: "new" | "contacted" | "booked" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

const TourEnquirySchema = new Schema<ITourEnquiry>(
  {
    tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    preferredDate: { type: Date, required: true },
    message: { type: String },
    status: { type: String, enum: ["new", "contacted", "booked", "cancelled"], default: "new" },
  },
  { timestamps: true },
)

export default mongoose.models.TourEnquiry || mongoose.model<ITourEnquiry>("TourEnquiry", TourEnquirySchema)

