"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecentBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings?limit=5")
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
        } else {
          console.error("Failed to fetch bookings")
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return <p className="text-muted-foreground">No bookings found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Room</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Guest</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Check-in</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Check-out</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="border-b">
              <td className="px-4 py-3 text-sm">#{booking._id.slice(0, 8)}</td>
              <td className="px-4 py-3 text-sm">{booking.roomName || "Unknown Room"}</td>
              <td className="px-4 py-3 text-sm">{booking.userName || "Unknown User"}</td>
              <td className="px-4 py-3 text-sm">{formatDate(booking.checkIn)}</td>
              <td className="px-4 py-3 text-sm">{formatDate(booking.checkOut)}</td>
              <td className="px-4 py-3 text-sm">
                <Badge className={`${getStatusColor(booking.status)} capitalize`}>{booking.status}</Badge>
              </td>
              <td className="px-4 py-3 text-sm">{formatPrice(booking.totalPrice)}</td>
              <td className="px-4 py-3 text-sm">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/bookings/${booking._id}`}>View</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

