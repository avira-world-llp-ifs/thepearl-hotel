import mongoose from "mongoose"

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a room name"],
    maxlength: [100, "Name cannot be more than 100 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: [0, "Price cannot be negative"],
  },
  capacity: {
    type: Number,
    required: [true, "Please provide capacity"],
    min: [1, "Capacity must be at least 1"],
  },
  size: {
    type: Number,
    required: [true, "Please provide room size"],
    min: [0, "Size cannot be negative"],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  images: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  featured: {
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
RoomSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Add a pre-save hook to log the document before saving
RoomSchema.pre("save", function (next) {
  console.log("Saving room document:", JSON.stringify(this.toObject(), null, 2))
  next()
})

export default mongoose.models.Room || mongoose.model("Room", RoomSchema)

