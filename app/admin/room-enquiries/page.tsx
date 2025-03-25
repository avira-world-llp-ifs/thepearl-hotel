import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, MessageSquare, Phone } from "lucide-react"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Room Enquiries | Admin Dashboard",
  description: "View all room enquiries",
}

async function getEnquiries() {
  try {
    // Import the enquiry service directly
    const { enquiryService } = await import("@/lib/db")

    // Get all enquiries directly from the service
    const enquiries = await enquiryService.getAll()
    return enquiries
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return []
  }
}

export default async function RoomEnquiriesPage() {
  const enquiries = await getEnquiries()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Room Enquiries</h1>

      <Card>
        <CardHeader>
          <CardTitle>Room Enquiries</CardTitle>
          <CardDescription>Manage room enquiries from potential guests</CardDescription>
        </CardHeader>
        <CardContent>
          {enquiries.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No enquiries found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry._id}>
                    <TableCell className="font-medium">{formatDate(enquiry.createdAt)}</TableCell>
                    <TableCell>{enquiry.name}</TableCell>
                    <TableCell>{enquiry.roomType}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{enquiry.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{enquiry.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={enquiry.isRead ? "outline" : "default"}>
                        {enquiry.isRead ? "Read" : "Unread"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/room-enquiries/${enquiry._id}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

