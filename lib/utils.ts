export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function calculateTotalPrice(roomPrice: number, nights: number, additionalFees = 0): number {
  return roomPrice * nights + additionalFees
}

export function formatPrice(price: number): string {
  return formatCurrency(price)
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "text-green-600 bg-green-50"
    case "pending":
      return "text-amber-600 bg-amber-50"
    case "cancelled":
      return "text-red-600 bg-red-50"
    case "completed":
      return "text-blue-600 bg-blue-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function formatBookingId(id: string): string {
  return `BK-${id.substring(0, 8).toUpperCase()}`
}

export function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ")
}

