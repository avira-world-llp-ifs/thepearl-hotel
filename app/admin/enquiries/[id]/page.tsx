"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Mail, Phone, Calendar, Users, Home, MessageSquare, CheckCircle, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function EnquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [enquiry, setEnquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const enquiryId = params?.id as string

  useEffect(() => {
    async function fetchData() {
      if (!enquiryId) return

      try {
        const response = await fetch(`/api/enquiries/${enquiryId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch enquiry data")
        }

        const data = await response.json()
        setEnquiry(data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [enquiryId])

  const handleMarkAsRead = async () => {
    if (!enquiry || enquiry.isRead) return

    setIsMarkingAsRead(true)

    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark enquiry as read")
      }

      const updatedEnquiry = await response.json()
      setEnquiry(updatedEnquiry)
    } catch (err) {
      console.error("Error marking as read:", err)
      alert("Failed to mark enquiry as read. Please try again.")
    } finally {
      setIsMarkingAsRead(false)
    }
  }

  const handleDelete = async () => {
    if (!enquiry) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete enquiry")
      }

      router.push("/admin/enquiries/unread")
    } catch (err) {
      console.error("Error deleting enquiry:", err)
      alert("Failed to delete enquiry. Please try again.")
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading enquiry...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/enquiries/unread">Back to Enquiries</Link>
        </Button>
      </div>
    )
  }

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Enquiry not found</p>
        <Button asChild variant="outline">
          <Link href="/admin/enquiries/unread">Back to Enquiries</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={enquiry.isRead ? "/admin/enquiries/read" : "/admin/enquiries/unread"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {enquiry.isRead ? "Read" : "Unread"} Enquiries
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Enquiry Details</h1>
        </div>
        <div className="flex gap-2">
          {!enquiry.isRead && (
            <Button variant="outline" size="sm" onClick={handleMarkAsRead} disabled={isMarkingAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {isMarkingAsRead ? "Marking as Read..." : "Mark as Read"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enquiry #{enquiry._id.toString().slice(0, 8)}</CardTitle>
              <Badge variant={enquiry.isRead ? "outline" : "default"}>{enquiry.isRead ? "Read" : "Unread"}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Message</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>{enquiry.message}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Enquiry Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg flex items-start">
                      <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Check-in Date</p>
                        <p>{formatDate(enquiry.dateFrom)}</p>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg flex items-start">
                      <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Check-out Date</p>
                        <p>{formatDate(enquiry.dateTo)}</p>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg flex items-start">
                      <Users className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Number of Guests</p>
                        <p>
                          {enquiry.numberOfMembers} {enquiry.numberOfMembers === 1 ? "Guest" : "Guests"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg flex items-start">
                      <Home className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Room Type</p>
                        <p className="capitalize">{enquiry.roomType}</p>
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
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Name</p>
                  <p>{enquiry.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>{enquiry.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>{enquiry.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Submitted on {formatDate(enquiry.createdAt)}</p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`mailto:${enquiry.email}?subject=RE: Your Enquiry at Luxury Hotel`}>Reply via Email</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the enquiry and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

