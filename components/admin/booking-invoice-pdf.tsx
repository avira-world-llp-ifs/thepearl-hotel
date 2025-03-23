"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface BookingInvoicePDFProps {
  bookingId: string
}

export function BookingInvoicePDF({ bookingId }: BookingInvoicePDFProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  const generatePDF = async () => {
    if (!invoiceRef.current) return

    // Show loading state
    const button = document.getElementById("download-pdf-button")
    if (button) {
      button.textContent = "Generating PDF..."
      button.setAttribute("disabled", "true")
    }

    try {
      // Import libraries dynamically
      const jsPDFModule = await import("jspdf")
      const html2canvasModule = await import("html2canvas")

      const jsPDF = jsPDFModule.default
      const html2canvas = html2canvasModule.default

      // Create a canvas from the invoice HTML
      const canvas = await html2canvas(document.querySelector(".invoice-container") as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add the canvas as an image to the PDF
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // If the image is taller than the page, split it into multiple pages
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the PDF
      pdf.save(`invoice-${bookingId}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      // Reset button state
      if (button) {
        button.textContent = "Download PDF"
        button.removeAttribute("disabled")
      }
    }
  }

  return {
    Button: (
      <Button id="download-pdf-button" onClick={generatePDF} variant="outline" size="sm" className="print:hidden">
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
    ),
    ref: invoiceRef,
  }
}

