import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    // Build query
    let query = {}

    if (featured === "true") {
      query = { featured: true }
    }

    // Get tours
    let toursQuery = db.collection("tours").find(query).sort({ createdAt: -1 })

    // Limit results if specified
    if (limit) {
      toursQuery = toursQuery.limit(limit)
    }

    const tours = await toursQuery.toArray()

    return NextResponse.json(tours)
  } catch (error) {
    console.error("Error fetching tours:", error)
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const data = await request.json()

    // Add timestamps
    const tourData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tours").insertOne(tourData)

    if (result.acknowledged) {
      return NextResponse.json(
        {
          _id: result.insertedId,
          ...tourData,
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json({ error: "Failed to create tour" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating tour:", error)
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 })
  }
}

