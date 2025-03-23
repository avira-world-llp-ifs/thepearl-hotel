import { NextResponse } from "next/server"
import { settingsService } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const settings = await settingsService.get()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ settings: null }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    const { section, data } = await request.json()

    if (!section || !data) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const updatedSettings = await settingsService.update(section, data)

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
      settings: updatedSettings,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to update settings" }, { status: 500 })
  }
}

