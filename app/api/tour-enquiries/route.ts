import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const tourEnquiries = await db.collection("tourEnquiries").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(tourEnquiries)
  } catch (error) {
    console.error("Error fetching tour enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch tour enquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tourName } = body

    // Only tourName is required
    if (!tourName) {
      return NextResponse.json({ error: "Tour Name is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Create a record with all fields optional except tourName
    const enquiryData = {
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      travelDate: body.travelDate ? new Date(body.travelDate) : null,
      guests: body.guests || "1",
      specialRequests: body.specialRequests || "",
      tourName,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tourEnquiries").insertOne(enquiryData)

    return NextResponse.json(
      {
        success: true,
        message: "Tour enquiry created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating tour enquiry:", error)
    return NextResponse.json({ error: "Failed to create tour enquiry" }, { status: 500 })
  }
}

