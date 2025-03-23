import { NextResponse } from "next/server"
import { seedUsers } from "@/lib/db/seed"

export async function GET() {
  try {
    await seedUsers()
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, message: "Error seeding database" }, { status: 500 })
  }
}

