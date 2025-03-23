"use client"

import { useState } from "react"

const BookingPage = () => {
  const [price, setPrice] = useState(100) // Example price

  return (
    <div>
      <h1>Book Your Appointment</h1>
      <p>Price: ₹{price}</p> {/* Replaced $ with ₹ */}
      <button onClick={() => setPrice(price + 50)}>Increase Price</button>
      <button onClick={() => setPrice(price - 50)}>Decrease Price</button>
      {/* Add booking form or other booking related components here */}
    </div>
  )
}

export default BookingPage

