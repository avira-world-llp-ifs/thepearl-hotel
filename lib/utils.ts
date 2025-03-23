import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utility
export function formatDate(date: Date | string): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Calculate number of nights between two dates
export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  if (!checkIn || !checkOut) return 0

  const checkInDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn
  const checkOutDate = typeof checkOut === "string" ? new Date(checkOut) : checkOut

  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

// Calculate total price based on room price and nights
export function calculateTotalPrice(pricePerNight: number, nights: number, additionalFees = 0): number {
  return pricePerNight * nights + additionalFees
}

// Format price with currency symbol
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

// Format currency with specified currency code
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get color based on booking status
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"
}

// Format booking ID with prefix
export function formatBookingId(id: string): string {
  if (!id) return ""

  // If the ID is already in the desired format, return it
  if (id.startsWith("BK-")) return id

  // Otherwise, format it with the BK prefix
  // Take the last 8 characters if the ID is longer
  const idPart = id.length > 8 ? id.substring(id.length - 8) : id
  return `BK-${idPart.toUpperCase()}`
}

