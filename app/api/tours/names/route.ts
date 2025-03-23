import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Fetch only the tour names from the database
    const tours = await db
      .collection("tours")
      .find({}, { projection: { name: 1, _id: 0 } })
      .toArray()

    // Extract just the names into a simple array
    const tourNames = tours.map((tour) => tour.name)

    return NextResponse.json(tourNames)
  } catch (error) {
    console.error("Error fetching tour names:", error)
    return NextResponse.json({ error: "Failed to fetch tour names" }, { status: 500 })
  }
}

