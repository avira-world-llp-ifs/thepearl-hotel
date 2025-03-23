import mongoose, { Schema, type Document } from "mongoose"

// Define the interface for Guest document
export interface IGuest extends Document {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  idType: string
  idNumber: string
  dateOfBirth: Date
  nationality: string
  preferences: string[]
  vipStatus: boolean
  notes: string
  createdAt: Date
  updatedAt: Date
}

// Define the Guest schema
const GuestSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    idType: {
      type: String,
      enum: ["passport", "driver_license", "national_id", "other"],
      required: [true, "ID type is required"],
    },
    idNumber: {
      type: String,
      required: [true, "ID number is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
    },
    preferences: {
      type: [String],
      default: [],
    },
    vipStatus: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Create and export the Guest model
const Guest = mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema)

export default Guest

