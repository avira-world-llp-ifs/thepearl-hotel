import { type NextRequest, NextResponse } from "next/server"
import { generalEnquiryService } from "@/lib/db/services/generalEnquiryService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const enquiry = await generalEnquiryService.getById(id)

    if (!enquiry) {
      return NextResponse.json({ error: "General enquiry not found" }, { status: 404 })
    }

    return NextResponse.json(enquiry)
  } catch (error) {
    console.error(`Error fetching general enquiry with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch general enquiry" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    const updatedEnquiry = await generalEnquiryService.update(id, data)

    if (!updatedEnquiry) {
      return NextResponse.json({ error: "General enquiry not found" }, { status: 404 })
    }

    return NextResponse.json(updatedEnquiry)
  } catch (error) {
    console.error(`Error updating general enquiry with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update general enquiry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const deletedEnquiry = await generalEnquiryService.delete(id)

    if (!deletedEnquiry) {
      return NextResponse.json({ error: "General enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting general enquiry with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete general enquiry" }, { status: 500 })
  }
}

