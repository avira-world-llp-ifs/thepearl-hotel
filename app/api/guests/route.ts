import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Guest from "@/models/guest"

export async function GET() {
  try {
    await dbConnect()
    const guests = await Guest.find({}).sort({ lastName: 1, firstName: 1 })
    return NextResponse.json(guests)
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await dbConnect()
    const guest = await Guest.create(body)
    return NextResponse.json(guest, { status: 201 })
  } catch (error: any) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: error.message || "Failed to create guest" }, { status: 500 })
  }
}

