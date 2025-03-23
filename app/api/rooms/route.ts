import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Room from "@/models/room"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Get all rooms
    const rooms = await Room.find({}).sort({ roomNumber: 1 })

    // Log the rooms data to help with debugging
    console.log(
      "API: Fetched rooms data:",
      JSON.stringify(
        rooms.map((r) => ({
          id: r._id,
          roomNumber: r.roomNumber,
          name: r.name,
          roomType: r.roomType,
          price: r.price,
          pricePerNight: r.pricePerNight,
          capacity: r.capacity,
        })),
      ),
    )

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    // Ensure price is a number
    if (body.price) {
      body.price = Number(body.price)
      if (isNaN(body.price)) {
        return NextResponse.json({ error: "Price must be a valid number" }, { status: 400 })
      }
      // Set pricePerNight to the same value for compatibility
      body.pricePerNight = body.price
    } else if (body.pricePerNight) {
      body.pricePerNight = Number(body.pricePerNight)
      if (isNaN(body.pricePerNight)) {
        return NextResponse.json({ error: "Price per night must be a valid number" }, { status: 400 })
      }
      // Set price to the same value for compatibility
      body.price = body.pricePerNight
    }

    // Ensure capacity is a number
    if (body.capacity) {
      body.capacity = Number(body.capacity)
      if (isNaN(body.capacity)) {
        return NextResponse.json({ error: "Capacity must be a valid number" }, { status: 400 })
      }
    }

    const room = await Room.create(body)
    return NextResponse.json(room, { status: 201 })
  } catch (error: any) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: error.message || "Failed to create room" }, { status: 500 })
  }
}

