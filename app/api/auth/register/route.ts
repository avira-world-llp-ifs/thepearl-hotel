import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/db/dbConnect"
import User from "@/lib/db/models/User"

export async function POST(request: Request) {
  try {
    console.log("Registration API called")

    const body = await request.json()
    const { name, email, password } = body

    console.log("Registration data received:", { name, email })

    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Ensure database connection is established
    console.log("Connecting to database...")
    await dbConnect()
    console.log("Database connection established")

    // Check if user already exists
    console.log("Checking if user already exists...")
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      console.log("User with this email already exists")
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    console.log("Creating new user...")
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
    })

    await newUser.save()
    console.log("User created successfully:", newUser._id)

    // Return the user without the password
    const userResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    // Return more specific error message
    const errorMessage = error.message || "An error occurred during registration"
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}

