import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Booking from "@/lib/models/Booking"
import Review from "@/lib/models/Review"
import User from "@/lib/models/User"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    await dbConnect()

    // Get booking count
    const bookingsCount = await Booking.countDocuments({
      userId: userId,
      status: { $ne: "cancelled" },
    })

    // Get user data including favorites
    const userData = await User.findById(userId).lean()
    const favoritesCount = userData?.favorites?.length || 0

    // Get reviews count
    const reviewsCount = await Review.countDocuments({ userId: userId })

    return NextResponse.json({
      bookingsCount,
      favoritesCount,
      reviewsCount,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}

