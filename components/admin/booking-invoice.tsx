"use client"

import { formatDate, formatPrice } from "@/lib/utils"
import { forwardRef } from "react"

interface BookingInvoiceProps {
  booking: any
  room: any
  user: any
  nights: number
}

export const BookingInvoice = forwardRef<HTMLDivElement, BookingInvoiceProps>(
  ({ booking, room, user, nights }, ref) => {
    const invoiceDate = new Date().toISOString()
    const invoiceNumber = `INV-${booking._id.toString().slice(0, 8)}`

    // Calculate subtotal, tax, and total
    const subtotal = room.price * nights
    const tax = subtotal * 0.1 // 10% tax
    const total = booking.totalPrice

    return (
      <div ref={ref} className="invoice-container bg-white rounded-lg border shadow-sm p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold">The Pearl</h2>
            <p className="text-muted-foreground">8721/1, Desh Bandhu Gupta Road,Pahar Ganj,New Delhi-110055(INDIA)</p>
            <p className="text-muted-foreground">+91 (11) 23633363,23634363</p>
            <p className="text-muted-foreground">hotelthepearl55@gmail.com</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold">INVOICE</h3>
            <p className="text-muted-foreground">Invoice #: {invoiceNumber}</p>
            <p className="text-muted-foreground">Date: {formatDate(invoiceDate)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Booking Details:</h3>
            <p>Booking ID: #{booking._id.toString().slice(0, 8)}</p>
            <p>Check-in: {formatDate(booking.checkIn)}</p>
            <p>Check-out: {formatDate(booking.checkOut)}</p>
            <p>
              Status: <span className="capitalize">{booking.status}</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Quantity</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4">
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}
                    </p>
                  </div>
                </td>
                <td className="text-right py-4">{formatPrice(room.price)}</td>
                <td className="text-right py-4">{nights} nights</td>
                <td className="text-right py-4">{formatPrice(subtotal)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-4">Service Fee</td>
                <td className="text-right py-4"></td>
                <td className="text-right py-4"></td>
                <td className="text-right py-4">{formatPrice(tax)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Tax (10%):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-b font-bold">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Thank you for choosing Luxury Hotel. We look forward to your stay!</p>
          <p>If you have any questions about this invoice, please contact our customer service.</p>
        </div>

        <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
      </div>
    )
  },
)
BookingInvoice.displayName = "BookingInvoice"

