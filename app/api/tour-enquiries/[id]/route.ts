import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const tourEnquiry = await db.collection("tourEnquiries").findOne({ _id: new ObjectId(id) })

    if (!tourEnquiry) {
      return NextResponse.json({ error: "Tour enquiry not found" }, { status: 404 })
    }

    return NextResponse.json(tourEnquiry)
  } catch (error) {
    console.error("Error fetching tour enquiry:", error)
    return NextResponse.json({ error: "Failed to fetch tour enquiry" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("tourEnquiries").updateOne({ _id: new ObjectId(id) }, { $set: body })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tour enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Tour enquiry updated successfully" })
  } catch (error) {
    console.error("Error updating tour enquiry:", error)
    return NextResponse.json({ error: "Failed to update tour enquiry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("tourEnquiries").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Tour enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Tour enquiry deleted successfully" })
  } catch (error) {
    console.error("Error deleting tour enquiry:", error)
    return NextResponse.json({ error: "Failed to delete tour enquiry" }, { status: 500 })
  }
}

