"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Mail, MessageSquare, Phone } from "lucide-react"

export default function GeneralEnquiriesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEnquiries() {
      setLoading(true)
      setError(null)

      try {
        let url = "/api/general-enquiries"

        if (activeTab === "unread") {
          url += "?isRead=false"
        } else if (activeTab === "read") {
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
  }, [activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const getSubjectLabel = (subject: string) => {
    const subjects: Record<string, string> = {
      general: "General Inquiry",
      reservation: "Reservation",
      feedback: "Feedback",
      complaint: "Complaint",
      business: "Business",
    }

    return subjects[subject] || subject
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">General Enquiries</h1>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Enquiries</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <EnquiriesTable enquiries={enquiries} loading={loading} error={error} getSubjectLabel={getSubjectLabel} />
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <EnquiriesTable enquiries={enquiries} loading={loading} error={error} getSubjectLabel={getSubjectLabel} />
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          <EnquiriesTable enquiries={enquiries} loading={loading} error={error} getSubjectLabel={getSubjectLabel} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EnquiriesTable({
  enquiries,
  loading,
  error,
  getSubjectLabel,
}: {
  enquiries: any[]
  loading: boolean
  error: string | null
  getSubjectLabel: (subject: string) => string
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading enquiries...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (enquiries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No enquiries found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enquiries</CardTitle>
        <CardDescription>Manage general enquiries from the contact form</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
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
                <TableCell>{getSubjectLabel(enquiry.subject)}</TableCell>
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
                    <Link href={`/admin/general-enquiries/${enquiry._id}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

