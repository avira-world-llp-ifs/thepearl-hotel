import type React from "react"

interface PriceDisplayProps {
  price: number
  currency?: string
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, currency = "₹" }) => {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price)

  return <span>{formattedPrice}</span>
}

export default PriceDisplay

