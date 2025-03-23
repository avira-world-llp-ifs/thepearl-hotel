import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db/dbConnect"
import Tour from "@/models/tour"
import mongoose from "mongoose"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    console.log("Fetching tour with ID:", params.id) // Debug log

    let tour

    // Check if ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      tour = await Tour.findById(params.id)
    } else {
      // If not a valid ObjectId, try to find by other fields
      tour = await Tour.findOne({
        $or: [{ id: params.id }, { slug: params.id }],
      })
    }

    if (!tour) {
      console.log("Tour not found for ID:", params.id)
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }

    console.log("Found tour:", tour.title)
    return NextResponse.json({ tour })
  } catch (error) {
    console.error("Error fetching tour:", error)
    return NextResponse.json({ error: "Failed to fetch tour" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const data = await req.json()
    const tour = await Tour.findByIdAndUpdate(params.id, data, { new: true })

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }

    return NextResponse.json({ tour })
  } catch (error) {
    console.error("Error updating tour:", error)
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const tour = await Tour.findByIdAndDelete(params.id)

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tour deleted successfully" })
  } catch (error) {
    console.error("Error deleting tour:", error)
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 })
  }
}

