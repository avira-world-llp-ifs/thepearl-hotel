import { type NextRequest, NextResponse } from "next/server"
import { facilityService } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const facilities = await facilityService.getAll()
    return NextResponse.json(facilities)
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json({ error: "Failed to fetch facilities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/facilities - Starting request")

    // First check if MongoDB is connected
    try {
      await dbConnect()
      console.log("MongoDB connection successful")
    } catch (dbError) {
      console.error("MongoDB connection failed:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    // Check if user is logged in
    const user = await getCurrentUser()
    if (!user) {
      console.log("User not authenticated")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user is admin
    if (user.role !== "admin") {
      console.log("User is not an admin:", user.role)
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
    }

    console.log("User authenticated as admin:", user.id)

    // Parse request body
    let data
    try {
      data = await request.json()
      console.log("Received facility data:", data)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parseError.message,
        },
        { status: 400 },
      )
    }

    // Validate required fields
    if (!data.name || !data.name.trim()) {
      return NextResponse.json({ error: "Facility name is required" }, { status: 400 })
    }
    if (!data.description || !data.description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    // Determine icon type
    const iconType = data.icon ? (data.icon.startsWith("/placeholder.svg") ? "image" : "text") : ""

    // Prepare facility data
    const facilityData = {
      name: data.name.trim(),
      description: data.description.trim(),
      icon: data.icon || "",
      iconType: iconType,
    }

    console.log("Prepared facility data:", facilityData)

    try {
      const facility = await facilityService.create(facilityData)
      console.log("Facility created successfully:", facility)
      return NextResponse.json(facility, { status: 201 })
    } catch (dbError) {
      console.error("Database error while creating facility:", dbError)
      return NextResponse.json(
        {
          error: "Database error while creating facility",
          details: dbError.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unhandled error in POST /api/facilities:", error)
    return NextResponse.json(
      {
        error: "Failed to create facility",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

