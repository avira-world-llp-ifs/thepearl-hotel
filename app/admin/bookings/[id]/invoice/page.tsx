"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { calculateNights } from "@/lib/utils"
import { ArrowLeft, Printer } from "lucide-react"
import { BookingInvoice } from "@/components/admin/booking-invoice"
import { BookingInvoicePDF } from "@/components/admin/booking-invoice-pdf"

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [room, setRoom] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [nights, setNights] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const invoiceRef = useRef<HTMLDivElement>(null)
  const bookingId = params?.id as string

  useEffect(() => {
    async function fetchData() {
      if (!bookingId) return

      try {
        const response = await fetch(`/api/bookings/${bookingId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch booking data")
        }

        const bookingData = await response.json()

        // Fetch room data
        const roomResponse = await fetch(`/api/rooms/${bookingData.roomId}`)
        if (!roomResponse.ok) {
          throw new Error("Failed to fetch room data")
        }
        const roomData = await roomResponse.json()

        // Fetch user data
        const userResponse = await fetch(`/api/users/${bookingData.userId}`)
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData = await userResponse.json()

        const nightsCount = calculateNights(bookingData.checkIn, bookingData.checkOut)

        setBooking(bookingData)
        setRoom(roomData)
        setUser(userData)
        setNights(nightsCount)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bookingId])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading invoice...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  if (!booking || !room || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Booking information not found</p>
        <Button asChild variant="outline">
          <Link href="/admin/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  const { Button: DownloadButton } = BookingInvoicePDF({ bookingId })

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/bookings/${booking._id.toString()}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Booking
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Invoice</h1>
        </div>
        <div className="flex gap-2">
          {DownloadButton}
          <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </div>

      <BookingInvoice ref={invoiceRef} booking={booking} room={room} user={user} nights={nights} />
    </div>
  )
}

