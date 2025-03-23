import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  // Only delete the cookie when explicitly requested
  cookies().delete("user_id")

  return NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}

