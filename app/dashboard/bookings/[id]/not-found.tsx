import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarX } from "lucide-react"

export default function BookingNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <CalendarX className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Booking Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The booking you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Button asChild>
        <Link href="/dashboard/bookings">Back to My Bookings</Link>
      </Button>
    </div>
  )
}

