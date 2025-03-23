import { type NextRequest, NextResponse } from "next/server"
import { enquiryService } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isRead = searchParams.get("isRead")

    if (isRead === "true") {
      const readEnquiries = await enquiryService.getRead()
      return NextResponse.json(readEnquiries)
    } else if (isRead === "false") {
      const unreadEnquiries = await enquiryService.getUnread()
      return NextResponse.json(unreadEnquiries)
    }

    const enquiries = await enquiryService.getAll()
    return NextResponse.json(enquiries)
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.dateFrom ||
      !data.dateTo ||
      !data.numberOfMembers ||
      !data.roomType ||
      !data.message
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create enquiry
    const enquiry = await enquiryService.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      dateFrom: new Date(data.dateFrom),
      dateTo: new Date(data.dateTo),
      numberOfMembers: data.numberOfMembers,
      roomType: data.roomType,
      message: data.message,
      isRead: false,
    })

    return NextResponse.json(enquiry, { status: 201 })
  } catch (error) {
    console.error("Error creating enquiry:", error)
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 })
  }
}

