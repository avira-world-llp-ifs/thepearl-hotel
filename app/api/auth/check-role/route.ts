import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({
      isAdmin: false,
      message: "Not authenticated",
    })
  }

  // Check if user role is admin (case insensitive)
  const isAdmin = typeof session.user.role === "string" && session.user.role.toLowerCase() === "admin"

  return NextResponse.json({
    isAdmin,
    role: session.user.role,
  })
}

