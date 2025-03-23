import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const enquiry = await db.collection("enquiries").findOne({
      _id: new ObjectId(params.id),
    })

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json(enquiry)
  } catch (error) {
    console.error("Error fetching enquiry:", error)
    return NextResponse.json({ error: "Failed to fetch enquiry" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const data = await request.json()

    // Only allow updating isRead field
    const updateData: { isRead?: boolean } = {}
    if (data.isRead !== undefined) updateData.isRead = data.isRead

    const result = await db.collection("enquiries").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    const updatedEnquiry = await db.collection("enquiries").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json(updatedEnquiry)
  } catch (error) {
    console.error("Error updating enquiry:", error)
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("enquiries").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting enquiry:", error)
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 })
  }
}

