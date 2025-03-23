import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Fetch only the tour titles from the database
    const tours = await db
      .collection("tours")
      .find({}, { projection: { title: 1, _id: 0 } })
      .toArray()

    // Extract just the titles into a simple array
    const tourTitles = tours.map((tour) => tour.title).filter(Boolean)

    return NextResponse.json(tourTitles)
  } catch (error) {
    console.error("Error fetching tour titles:", error)
    return NextResponse.json({ error: "Failed to fetch tour titles" }, { status: 500 })
  }
}

