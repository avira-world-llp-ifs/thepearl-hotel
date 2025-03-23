import mongoose from "mongoose"

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A tour must have a title"],
      trim: true,
      maxlength: [100, "A tour title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "A tour must have a description"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070",
    },
    images: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      required: [true, "A tour must have a duration"],
    },
    location: {
      type: String,
      required: [true, "A tour must have a location"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    maxGroupSize: {
      type: Number,
      default: 15,
    },
    maxParticipants: {
      type: Number,
      default: 15,
    },
    startDates: {
      type: [Date],
      default: [],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    itinerary: {
      type: [
        {
          day: Number,
          title: String,
          description: String,
          activities: [String],
        },
      ],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Check if the model is already defined to prevent overwriting
const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema)

export default Tour

