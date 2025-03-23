import { type NextRequest, NextResponse } from "next/server"
import { roomService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const room = await roomService.getById(params.id)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    const data = await request.json()
    console.log("Updating room data:", data)

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 })
    }
    if (!data.description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }
    if (!data.price) {
      return NextResponse.json({ error: "Price is required" }, { status: 400 })
    }
    if (!data.capacity) {
      return NextResponse.json({ error: "Capacity is required" }, { status: 400 })
    }
    if (!data.size) {
      return NextResponse.json({ error: "Room size is required" }, { status: 400 })
    }

    // Ensure numeric values are properly parsed
    const roomData = {
      name: data.name,
      description: data.description,
      price: typeof data.price === "number" ? data.price : Number.parseFloat(data.price),
      capacity: typeof data.capacity === "number" ? data.capacity : Number.parseInt(data.capacity),
      size: typeof data.size === "number" ? data.size : Number.parseInt(data.size),
      images: data.images || [],
      amenities: data.amenities || [],
      featured: data.featured || false,
    }

    const room = await roomService.update(params.id, roomData)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error updating room:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    const room = await roomService.delete(params.id)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Room deleted successfully" })
  } catch (error) {
    console.error("Error deleting room:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}

