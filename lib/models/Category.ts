import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  basePrice: {
    type: Number,
    required: [true, "Please provide a base price"],
    min: [0, "Base price cannot be negative"],
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
CategorySchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Category || mongoose.model("Category", CategorySchema)

