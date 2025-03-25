"use server"

import { updateBookingStatus as updateBookingStatusService } from "@/services/booking-service"
import { revalidatePath } from "next/cache"

export async function updateBookingStatus(id: string, status: string) {
  try {
    const updatedBooking = await updateBookingStatusService(id, status)

    if (!updatedBooking) {
      return { success: false, message: "Booking not found" }
    }

    // Revalidate the booking page and bookings list
    revalidatePath(`/admin/bookings/${id}`)
    revalidatePath("/admin/bookings")

    return { success: true, message: "Booking status updated successfully" }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, message: "Failed to update booking status" }
  }
}

