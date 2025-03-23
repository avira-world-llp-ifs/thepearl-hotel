import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, Heart, Star } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/mongodb"
import Booking from "@/lib/models/Booking"
import Review from "@/lib/models/Review"
import User from "@/lib/models/User"

async function getUserStats(userId: string) {
  try {
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

    return {
      bookingsCount,
      favoritesCount,
      reviewsCount,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      bookingsCount: 0,
      favoritesCount: 0,
      reviewsCount: 0,
    }
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/dashboard")
  }

  const { bookingsCount, favoritesCount, reviewsCount } = await getUserStats(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground mt-2">Manage your bookings, favorites, and account settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Bookings</CardTitle>
            <CardDescription>View and manage your current and past bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CalendarClock className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{bookingsCount}</span>
              </div>
              <Button asChild>
                <Link href="/dashboard/bookings">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Favorites</CardTitle>
            <CardDescription>Rooms and properties you've saved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{favoritesCount}</span>
              </div>
              <Button asChild>
                <Link href="/dashboard/favorites">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Reviews</CardTitle>
            <CardDescription>Reviews you've left for properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{reviewsCount}</span>
              </div>
              <Button asChild>
                <Link href="/dashboard/reviews">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

