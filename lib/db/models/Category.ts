import mongoose, { Schema, type Document } from "mongoose"

export interface ICategory extends Document {
  name: string
  description: string
  basePrice: number
  image?: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: [true, "Category name is required"], unique: true },
    description: { type: String, required: [true, "Description is required"] },
    basePrice: { type: Number, required: [true, "Base price is required"], min: 0 },
    image: { type: String },
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)

export default Category

