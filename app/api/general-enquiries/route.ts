import { type NextRequest, NextResponse } from "next/server"
import { generalEnquiryService } from "@/lib/db/services/generalEnquiryService"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isRead = searchParams.get("isRead")

    if (isRead === "true") {
      const readEnquiries = await generalEnquiryService.getRead()
      return NextResponse.json(readEnquiries)
    } else if (isRead === "false") {
      const unreadEnquiries = await generalEnquiryService.getUnread()
      return NextResponse.json(unreadEnquiries)
    }

    const enquiries = await generalEnquiryService.getAll()
    return NextResponse.json(enquiries)
  } catch (error) {
    console.error("Error fetching general enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch general enquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create enquiry
    const enquiry = await generalEnquiryService.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    })

    return NextResponse.json(enquiry, { status: 201 })
  } catch (error) {
    console.error("Error creating general enquiry:", error)
    return NextResponse.json({ error: "Failed to create general enquiry" }, { status: 500 })
  }
}

