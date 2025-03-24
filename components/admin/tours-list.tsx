"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Eye, MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteTourButton } from "@/components/admin/delete-tour-button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function AdminToursList() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/tours")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setTours(data)
      } catch (err) {
        console.error("Failed to fetch tours:", err)
        setError("Failed to load tours. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "difficult":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <Button variant="outline" className="mt-2" onClick={() => router.refresh()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tours.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No tours found. Create your first tour package.
              </TableCell>
            </TableRow>
          ) : (
            tours.map((tour) => (
              <TableRow key={tour._id}>
                <TableCell>
                  {tour.images && tour.images.length > 0 ? (
                    <Image
                      src={tour.images[0] || "/placeholder.svg"}
                      alt={tour.title}
                      width={60}
                      height={40}
                      className="rounded object-cover"
                      style={{ width: "60px", height: "40px" }}
                    />
                  ) : (
                    <div className="w-[60px] h-[40px] bg-muted rounded flex items-center justify-center">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{tour.title}</TableCell>
                <TableCell>{tour.location}</TableCell>
                <TableCell>{tour.duration}</TableCell>
                <TableCell>₹{tour.price?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getDifficultyColor(tour.difficulty)} variant="outline">
                    {tour.difficulty || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {tour.featured ? (
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/tours/${tour._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/tours/edit/${tour._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteTourButton id={tour._id} onDelete={() => router.refresh()} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

