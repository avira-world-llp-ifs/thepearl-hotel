import mongoose from "mongoose"

const FacilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a facility name"],
    maxlength: [100, "Name cannot be more than 100 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  icon: {
    type: String,
    default: "",
  },
  iconType: {
    type: String,
    enum: ["text", "image", ""],
    default: "",
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
FacilitySchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Add a pre-save hook to log the document before saving
FacilitySchema.pre("save", function (next) {
  console.log("Saving facility document:", JSON.stringify(this.toObject(), null, 2))
  next()
})

export default mongoose.models.Facility || mongoose.model("Facility", FacilitySchema)

