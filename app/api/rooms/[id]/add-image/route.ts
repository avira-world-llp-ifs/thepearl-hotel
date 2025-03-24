import { type NextRequest, NextResponse } from "next/server"
import { roomService } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const roomId = params.id
    const imageUrl = formData.get("imageUrl") as string

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Get the current room
    const room = await roomService.getById(roomId)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Check if adding this URL would exceed the 5 image limit
    const currentImages = room.images || []
    if (currentImages.length >= 5) {
      return NextResponse.json({ error: "Maximum of 5 images allowed" }, { status: 400 })
    }

    // Add the new image URL to the room's images
    const updatedImages = [...currentImages, imageUrl]

    // Update the room with the new images array
    const updatedRoom = await roomService.update(roomId, {
      images: updatedImages,
    })

    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error("Error adding image URL:", error)
    return NextResponse.json({ error: "Failed to add image URL" }, { status: 500 })
  }
}

