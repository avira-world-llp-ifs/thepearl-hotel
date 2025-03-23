import { connectToDatabase } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"

export interface Tour {
  _id: string | ObjectId
  title: string
  description: string
  price: number
  duration: number
  maxGroupSize: number
  difficulty: string
  ratingsAverage?: number
  ratingsQuantity?: number
  images?: string[]
  startDates?: Date[]
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export async function getAllTours(options: { featured?: boolean; limit?: number } = {}) {
  try {
    const { db } = await connectToDatabase()

    // Build query
    let query = {}

    if (options.featured) {
      query = { featured: true }
    }

    // Get tours
    let toursQuery = db.collection("tours").find(query).sort({ createdAt: -1 })

    // Limit results if specified
    if (options.limit) {
      toursQuery = toursQuery.limit(options.limit)
    }

    const tours = await toursQuery.toArray()

    // Convert ObjectId to string for serialization
    return tours.map((tour) => ({
      ...tour,
      _id: tour._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching tours:", error)
    throw new Error("Failed to fetch tours")
  }
}

export async function getTourById(id: string) {
  try {
    const { db } = await connectToDatabase()

    const tour = await db.collection("tours").findOne({ _id: new ObjectId(id) })

    if (!tour) {
      throw new Error("Tour not found")
    }

    // Convert ObjectId to string for serialization
    return {
      ...tour,
      _id: tour._id.toString(),
    }
  } catch (error) {
    console.error(`Error fetching tour with ID ${id}:`, error)
    throw new Error("Failed to fetch tour")
  }
}

export async function createTour(tourData: Omit<Tour, "_id">) {
  try {
    const { db } = await connectToDatabase()

    // Add timestamps
    const data = {
      ...tourData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tours").insertOne(data)

    if (!result.acknowledged) {
      throw new Error("Failed to create tour")
    }

    return {
      _id: result.insertedId.toString(),
      ...data,
    }
  } catch (error) {
    console.error("Error creating tour:", error)
    throw new Error("Failed to create tour")
  }
}

export async function updateTour(id: string, tourData: Partial<Omit<Tour, "_id">>) {
  try {
    const { db } = await connectToDatabase()

    // Add updated timestamp
    const data = {
      ...tourData,
      updatedAt: new Date(),
    }

    const result = await db.collection("tours").updateOne({ _id: new ObjectId(id) }, { $set: data })

    if (!result.acknowledged) {
      throw new Error("Failed to update tour")
    }

    return {
      _id: id,
      ...data,
    }
  } catch (error) {
    console.error(`Error updating tour with ID ${id}:`, error)
    throw new Error("Failed to update tour")
  }
}

export async function deleteTour(id: string) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("tours").deleteOne({ _id: new ObjectId(id) })

    if (!result.acknowledged || result.deletedCount === 0) {
      throw new Error("Failed to delete tour")
    }

    return { success: true }
  } catch (error) {
    console.error(`Error deleting tour with ID ${id}:`, error)
    throw new Error("Failed to delete tour")
  }
}

