"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateBookingStatus } from "@/actions/booking"
import { useToast } from "@/components/ui/use-toast"

interface UpdateBookingStatusProps {
  bookingId: string
  currentStatus: string
}

export function UpdateBookingStatus({ bookingId, currentStatus }: UpdateBookingStatusProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdateStatus = async () => {
    if (status === currentStatus) return

    setIsLoading(true)
    try {
      const result = await updateBookingStatus(bookingId, status)

      if (result.success) {
        toast({
          title: "Status updated",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleUpdateStatus} disabled={isLoading || status === currentStatus} size="sm">
        {isLoading ? "Updating..." : "Update"}
      </Button>
    </div>
  )
}

