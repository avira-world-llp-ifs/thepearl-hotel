import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"
import { bookingService, roomService, userService } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  try {
    // This will throw an error if the user is not an admin
    const user = await requireAdmin()

    // Fetch data from database
    const [pendingBookings, totalUsers, totalRooms] = await Promise.all([
      bookingService.getAll().then((bookings) => bookings.filter((booking) => booking.status === "pending")),
      userService.getAll().then((users) => users.length),
      roomService.getAll().then((rooms) => rooms.length),
    ])

    return (
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Welcome back, {user.name || user.email}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>Manage all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingBookings.length > 0 ? (
                <div>
                  <p className="mb-2">{pendingBookings.length} pending bookings to review.</p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/admin/bookings">View all bookings</Link>
                  </Button>
                </div>
              ) : (
                <p>No pending bookings to review.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p className="mb-2">Total users: {totalUsers}</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/users">Manage users</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rooms</CardTitle>
              <CardDescription>Manage room inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p className="mb-2">Total rooms: {totalRooms}</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/rooms">Manage rooms</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    // This error will be handled by the layout
    throw error
  }
}

