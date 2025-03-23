import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/user"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    await dbConnect()
    const users = await User.find({}).sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()

    // Hash the password
    if (body.password) {
      const salt = await bcrypt.genSalt(10)
      body.password = await bcrypt.hash(body.password, salt)
    }

    const user = await User.create(body)
    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

