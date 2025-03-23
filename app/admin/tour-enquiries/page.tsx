import type { Metadata } from "next"
import { format } from "date-fns"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { connectToDatabase } from "@/lib/db/mongodb"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tour Enquiries | Admin Dashboard",
  description: "Manage tour booking enquiries",
}

async function getTourEnquiries() {
  try {
    const { db } = await connectToDatabase()
    const enquiries = await db.collection("tourEnquiries").find({}).sort({ createdAt: -1 }).toArray()
    return JSON.parse(JSON.stringify(enquiries))
  } catch (error) {
    console.error("Error fetching tour enquiries:", error)
    return []
  }
}

export default async function TourEnquiriesPage() {
  const enquiries = await getTourEnquiries()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tour Enquiries</h1>
        <p className="text-muted-foreground">Manage and respond to tour booking requests from customers.</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No tour enquiries found.
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((enquiry) => (
                <TableRow key={enquiry._id}>
                  <TableCell className="font-medium">{enquiry.name}</TableCell>
                  <TableCell>{enquiry.tourName}</TableCell>
                  <TableCell>
                    {enquiry.travelDate ? format(new Date(enquiry.travelDate), "MMM d, yyyy") : "Not specified"}
                  </TableCell>
                  <TableCell>{enquiry.guests}</TableCell>
                  <TableCell>
                    <Badge variant={enquiry.isRead ? "outline" : "default"}>{enquiry.isRead ? "Read" : "Unread"}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(enquiry.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/tour-enquiries/${enquiry._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

