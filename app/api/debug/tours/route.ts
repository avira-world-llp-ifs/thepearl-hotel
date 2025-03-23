import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db/dbConnect"
import mongoose from "mongoose"

export async function GET() {
  try {
    await dbConnect()

    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Check if tours collection exists
    const hasTours = collectionNames.includes("tours")

    let tourCount = 0
    let sampleTour = null

    if (hasTours) {
      // Count documents in tours collection
      tourCount = await mongoose.connection.db.collection("tours").countDocuments()

      // Get a sample tour if any exist
      if (tourCount > 0) {
        sampleTour = await mongoose.connection.db.collection("tours").findOne({})
      }
    }

    return NextResponse.json({
      dbConnected: true,
      collections: collectionNames,
      hasTours,
      tourCount,
      sampleTour,
    })
  } catch (error) {
    console.error("Database debug error:", error)
    return NextResponse.json(
      {
        dbConnected: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

