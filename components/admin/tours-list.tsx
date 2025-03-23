"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Eye, Loader2 } from "lucide-react"
import { DeleteTourButton } from "./delete-tour-button"
import { Badge } from "@/components/ui/badge"
import { FallbackImage } from "@/components/fallback-image"

export default function AdminToursList() {
  const router = useRouter()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  const handleDelete = (deletedId) => {
    setTours(tours.filter((tour) => tour._id !== deletedId))
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

  if (tours.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="mb-4">No tour packages found.</p>
          <Button asChild>
            <Link href="/admin/tours/new">Create Your First Tour</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {tours.map((tour) => (
        <Card key={tour._id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 h-48 md:h-auto relative">
              <FallbackImage
                src={tour.images?.[0] || "/placeholder.svg?height=200&width=300"}
                alt={tour.title}
                className="object-cover h-full w-full"
              />
            </div>
            <CardContent className="flex-1 p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{tour.title}</h3>
                    {tour.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <p className="text-muted-foreground mb-2">{tour.location}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{tour.duration}</Badge>
                    <Badge variant="outline">₹{tour.price.toLocaleString()}</Badge>
                    <Badge variant="outline">Max: {tour.maxGroupSize} people</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{tour.description}</p>
                </div>
                <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/tours/${tour._id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/tours/edit/${tour._id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteTourButton id={tour._id} onDelete={() => handleDelete(tour._id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DeleteTourButton>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}

