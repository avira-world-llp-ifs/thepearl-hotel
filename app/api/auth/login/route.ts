import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db/dbConnect"
import { userService } from "@/lib/db/index"
import bcrypt from "bcryptjs"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection is established
    await dbConnect()

    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await userService.findByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token with role information
    const token = sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    // Set cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user data (without password) including role
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

