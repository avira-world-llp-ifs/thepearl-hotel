import { type NextRequest, NextResponse } from "next/server"
import { facilityService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const facility = await facilityService.getById(params.id)

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }

    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error fetching facility:", error)
    return NextResponse.json({ error: "Failed to fetch facility" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    const data = await request.json()
    console.log("Updating facility data:", data)

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Facility name is required" }, { status: 400 })
    }
    if (!data.description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    // Determine icon type if icon is provided
    if (data.icon && !data.iconType) {
      data.iconType = data.icon.startsWith("/placeholder.svg") ? "image" : "text"
    }

    const facility = await facilityService.update(params.id, data)

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }

    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error updating facility:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update facility" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    const facility = await facilityService.delete(params.id)

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Facility deleted successfully" })
  } catch (error) {
    console.error("Error deleting facility:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to delete facility" }, { status: 500 })
  }
}

