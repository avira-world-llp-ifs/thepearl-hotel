"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Mail, MessageSquare, Phone } from "lucide-react"

interface EnquiriesTableProps {
  status: "all" | "read" | "unread"
}

const EnquiriesTable = ({ status }: EnquiriesTableProps) => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEnquiries() {
      setLoading(true)
      setError(null)

      try {
        let url = "/api/enquiries"

        if (status === "unread") {
          url += "?isRead=false"
        } else if (status === "read") {
          url += "?isRead=true"
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch enquiries")
        }

        const data = await response.json()
        setEnquiries(data)
      } catch (err) {
        console.error("Error fetching enquiries:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiries()
  }, [status])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enquiries</CardTitle>
        <CardDescription>Manage room enquiries from the contact form</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading enquiries...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : enquiries.length === 0 ? (
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
                    <Badge variant={enquiry.isRead ? "outline" : "default"}>{enquiry.isRead ? "Read" : "Unread"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/enquiries/${enquiry._id}`}>
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
  )
}

export default EnquiriesTable

