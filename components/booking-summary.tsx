import type React from "react"

interface BookingSummaryProps {
  totalPrice: number
  numberOfNights: number
  roomType: string
  hotelName: string
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ totalPrice, numberOfNights, roomType, hotelName }) => {
  return (
    <div>
      <h2>Booking Summary</h2>
      <p>Hotel: {hotelName}</p>
      <p>Room Type: {roomType}</p>
      <p>Number of Nights: {numberOfNights}</p>
      <p>Total Price: ₹{totalPrice}</p>
    </div>
  )
}

export default BookingSummary

