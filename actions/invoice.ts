"use server"

import { getBookingById } from "@/services/booking-service"
import { formatCurrency, formatDate } from "@/lib/utils"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

export async function generateInvoicePdf(bookingId: string) {
  try {
    // Fetch booking details
    const booking = await getBookingById(bookingId)

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    // Create a new PDF document
    const doc = new jsPDF()

    // Add hotel logo and header
    doc.setFontSize(22)
    doc.setTextColor(205, 164, 52) // Golden color
    doc.text("Hotel The Pearl", 105, 20, { align: "center" })

    // Add hotel address and contact
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text("5-Star Luxury Hotel", 105, 28, { align: "center" })
    doc.text("New Delhi, India", 105, 34, { align: "center" })
    doc.text("+91 (11) 23633363, 23634363", 105, 40, { align: "center" })
    doc.text("hotelthepearl55@gmail.com", 105, 46, { align: "center" })

    // Add invoice title
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text("INVOICE", 105, 60, { align: "center" })

    // Add invoice details
    doc.setFontSize(10)
    doc.text(`Invoice #: INV-${bookingId.substring(0, 8).toUpperCase()}`, 20, 75)
    doc.text(`Date: ${formatDate(new Date())}`, 20, 82)
    doc.text(`Booking ID: ${bookingId}`, 20, 89)

    // Add customer details
    doc.setFontSize(12)
    doc.text("Bill To:", 20, 105)
    doc.setFontSize(10)
    doc.text(booking.customerName || booking.guestName || "Guest", 20, 112)
    doc.text(booking.customerEmail || booking.email || "N/A", 20, 119)
    doc.text(booking.customerPhone || booking.phone || "N/A", 20, 126)

    // Add booking details
    doc.setFontSize(12)
    doc.text("Booking Details:", 20, 143)

    // Create a table for booking details
    ;(doc as any).autoTable({
      startY: 150,
      head: [["Description", "Check-in", "Check-out", "Guests", "Amount"]],
      body: [
        [
          `${booking.roomName || ""} (${booking.roomType})`,
          formatDate(booking.checkIn),
          formatDate(booking.checkOut),
          (booking.guests || (booking.adults || 0) + (booking.children || 0)).toString(),
          formatCurrency(booking.totalPrice || booking.totalAmount || 0),
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [205, 164, 52], textColor: [255, 255, 255] },
    })

    // Add total amount
    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.text("Total Amount:", 130, finalY)
    doc.setFontSize(14)
    doc.setFont(undefined, "bold")
    doc.text(formatCurrency(booking.totalPrice || booking.totalAmount || 0), 170, finalY, { align: "right" })

    // Add payment status
    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    doc.text(`Payment Status: ${(booking.paymentStatus || "pending").toUpperCase()}`, 170, finalY + 10, {
      align: "right",
    })

    // Add footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text("Thank you for choosing Hotel The Pearl. We look forward to serving you again.", 105, 270, {
      align: "center",
    })
    doc.text("This is a computer-generated invoice and does not require a signature.", 105, 275, { align: "center" })

    // Convert the PDF to a base64 string
    const pdfBase64 = doc.output("datauristring")

    return {
      success: true,
      data: pdfBase64,
    }
  } catch (error) {
    console.error("Error generating invoice:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function generateInvoiceData(bookingId: string) {
  try {
    // Fetch booking details
    const booking = await getBookingById(bookingId)

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    // Return the booking data for client-side rendering
    return {
      success: true,
      data: booking,
    }
  } catch (error) {
    console.error("Error generating invoice:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

