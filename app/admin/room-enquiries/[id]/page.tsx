import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle, Mail, Phone, User, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Room Enquiry Details | Admin Dashboard",
  description: "View room enquiry details",
}

async function getEnquiry(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}`, {
      cache: "no-store",
      method: "GET",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch enquiry")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching enquiry:", error)
    return null
  }
}

async function updateEnquiryStatus(id: string, status: { isRead?: boolean }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    })

    if (!response.ok) {
      throw new Error("Failed to update enquiry status")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating enquiry status:", error)
    return null
  }
}

export default async function EnquiryDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "admin")) {
    redirect("/login")
  }

  const enquiry = await getEnquiry(params.id)

  if (!enquiry) {
    redirect("/admin/room-enquiries")
  }

  // Mark as read if not already read
  if (!enquiry.isRead) {
    await updateEnquiryStatus(params.id, { isRead: true })
  }

  async function markAsRead() {
    "use server"
    await updateEnquiryStatus(params.id, { isRead: true })
    redirect(`/admin/room-enquiries/${params.id}`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" className="mr-4">
          <Link href="/admin/room-enquiries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Enquiries
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Room Enquiry Details</h1>
        <div className="ml-4 flex gap-2">
          <Badge variant={enquiry.isRead ? "outline" : "secondary"}>{enquiry.isRead ? "Read" : "Unread"}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Enquiry Information</CardTitle>
            <CardDescription>Details of the room enquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-lg font-medium">{enquiry.name}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted On</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <p>{formatDate(enquiry.createdAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Room Type</h3>
              <p className="text-lg font-medium">{enquiry.roomType}</p>
            </div>

            {enquiry.checkIn && enquiry.checkOut && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-in Date</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <p>{formatDate(enquiry.checkIn)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-out Date</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <p>{formatDate(enquiry.checkOut)}</p>
                  </div>
                </div>
              </div>
            )}

            {enquiry.guests && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Number of Guests</h3>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <p>{enquiry.guests}</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <p>{enquiry.email}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <p>{enquiry.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Message</h3>
              <p className="whitespace-pre-wrap p-4 bg-muted rounded-md">{enquiry.message || "No message provided."}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Respond to this enquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href={`mailto:${enquiry.email}?subject=RE: Room Enquiry - ${enquiry.roomType}`}>
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/bookings/new">
                <Calendar className="h-4 w-4 mr-2" />
                Create Booking
              </Link>
            </Button>

            {!enquiry.isRead && (
              <form action={markAsRead}>
                <Button type="submit" variant="secondary" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

