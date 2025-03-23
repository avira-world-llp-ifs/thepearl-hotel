import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      role: user.role,
      redirectTo: user.role === "ADMIN" ? "/admin" : "/dashboard",
    })
  } catch (error) {
    console.error("Error checking role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

