import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Mail, Calendar, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { connectToDatabase } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"
import Link from "next/link"
import { markAsRead } from "@/app/actions/tour-enquiries"

export const metadata: Metadata = {
  title: "Tour Enquiry Details | Admin Dashboard",
  description: "View and manage tour enquiry details",
}

interface TourEnquiryDetailPageProps {
  params: {
    id: string
  }
}

async function getTourEnquiry(id: string) {
  try {
    const { db } = await connectToDatabase()
    const enquiry = await db.collection("tourEnquiries").findOne({ _id: new ObjectId(id) })

    if (!enquiry) {
      return null
    }

    // Mark as read if not already
    if (!enquiry.isRead) {
      await db
        .collection("tourEnquiries")
        .updateOne({ _id: new ObjectId(id) }, { $set: { isRead: true, updatedAt: new Date() } })
      enquiry.isRead = true
    }

    return JSON.parse(JSON.stringify(enquiry))
  } catch (error) {
    console.error("Error fetching tour enquiry:", error)
    return null
  }
}

export default async function TourEnquiryDetailPage({ params }: TourEnquiryDetailPageProps) {
  const enquiry = await getTourEnquiry(params.id)

  if (!enquiry) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/tour-enquiries">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Tour Enquiry Details</h1>
        </div>
        <Badge variant={enquiry.isRead ? "outline" : "default"}>{enquiry.isRead ? "Read" : "Unread"}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enquiry Information</CardTitle>
            <CardDescription>Details about the tour booking request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Tour Package</h3>
              <p className="text-lg">{enquiry.tourName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Travel Date</h3>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <p>{enquiry.travelDate ? format(new Date(enquiry.travelDate), "MMMM d, yyyy") : "Not specified"}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Number of Guests</h3>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <p>{enquiry.guests}</p>
              </div>
            </div>
            {enquiry.specialRequests && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Special Requests</h3>
                <div className="flex items-start">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                  <p className="whitespace-pre-line">{enquiry.specialRequests}</p>
                </div>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Date Received</h3>
              <p>{format(new Date(enquiry.createdAt), "MMMM d, yyyy, h:mm a")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
            <CardDescription>Contact details of the guest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Full Name</h3>
              <p className="text-lg">{enquiry.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Email</h3>
              <p>{enquiry.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Phone</h3>
              <p>{enquiry.phone}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-start space-x-2">
            <a href={`mailto:${enquiry.email}?subject=Regarding Your Tour Booking Request for ${enquiry.tourName}`}>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </Button>
            </a>
            {!enquiry.isRead && (
              <form action={markAsRead}>
                <input type="hidden" name="id" value={enquiry._id} />
                <Button variant="outline" type="submit">
                  Mark as Read
                </Button>
              </form>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

