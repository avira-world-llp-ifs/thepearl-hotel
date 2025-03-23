import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { userService, bookingService } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, User, Mail, Calendar, BookOpen } from "lucide-react"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const user = await userService.getById(params.id)

  if (!user) {
    notFound()
  }

  const bookings = await bookingService.getByUserId(user._id.toString())
  const bookingsCount = Array.isArray(bookings) ? bookings.length : 0

  // Get the most recent booking
  const latestBooking =
    Array.isArray(bookings) && bookings.length > 0
      ? bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                      <span className="text-muted-foreground">Member since {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-primary mr-3" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-primary mr-3" />
                        <span>Created: {formatDate(user.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-primary mr-3" />
                        <span>Last Updated: {formatDate(user.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Bookings</p>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <p className="text-lg font-bold">{bookingsCount}</p>
                </div>
              </div>

              {latestBooking && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Latest Booking</p>
                  <p className="font-medium">
                    {formatDate(latestBooking.checkIn)} - {formatDate(latestBooking.checkOut)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">Status: {latestBooking.status}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link href={`/admin/bookings?userId=${user._id.toString()}`}>View All Bookings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

