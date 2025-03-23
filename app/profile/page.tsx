import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { bookingService } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export default async function ProfilePage() {
  const user = await requireAuth()

  // Get user's bookings
  const bookings = await bookingService.getByUserId(user.id)
  const bookingsCount = Array.isArray(bookings) ? bookings.length : 0

  // Get the most recent booking
  const latestBooking =
    Array.isArray(bookings) && bookings.length > 0
      ? bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <p className="text-lg capitalize">{user.role}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Overview of your bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-lg">{bookingsCount}</p>
              </div>

              {latestBooking && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Latest Booking</p>
                  <p className="text-lg">
                    {formatDate(latestBooking.checkIn)} - {formatDate(latestBooking.checkOut)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">Status: {latestBooking.status}</p>
                </div>
              )}

              <Button asChild>
                <Link href="/bookings">View All Bookings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Things you can do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center justify-center">
                <Link href="/rooms">
                  <span className="text-lg font-medium">Browse Rooms</span>
                  <span className="text-sm text-muted-foreground">Find your perfect stay</span>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center justify-center">
                <Link href="/bookings">
                  <span className="text-lg font-medium">My Bookings</span>
                  <span className="text-sm text-muted-foreground">Manage your reservations</span>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center justify-center">
                <Link href="/contact">
                  <span className="text-lg font-medium">Contact Us</span>
                  <span className="text-sm text-muted-foreground">Need help? Get in touch</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

