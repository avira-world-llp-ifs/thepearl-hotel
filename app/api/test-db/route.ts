import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing database connection...")
    await dbConnect()
    console.log("Database connection successful!")

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      mongodbUri: process.env.MONGODB_URI ? "Configured" : "Missing",
    })
  } catch (error) {
    console.error("Database connection test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

