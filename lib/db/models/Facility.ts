import mongoose, { Schema, type Document } from "mongoose"

export interface IFacility extends Document {
  name: string
  description?: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

const FacilitySchema = new Schema<IFacility>(
  {
    name: { type: String, required: [true, "Facility name is required"], unique: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
const Facility = mongoose.models.Facility || mongoose.model<IFacility>("Facility", FacilitySchema)

export default Facility

