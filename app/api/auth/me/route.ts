import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log("No session or user found in /api/auth/me")
      return NextResponse.json({ user: null }, { status: 401 })
    }

    console.log("User found in session:", {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    })

    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json({ error: "An error occurred while fetching the current user" }, { status: 500 })
  }
}

