import type React from "react"

interface BookingSummaryProps {
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  roomType: string
  totalPrice: number
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  checkInDate,
  checkOutDate,
  numberOfGuests,
  roomType,
  totalPrice,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Booking Summary</h2>
      <div className="mb-2">
        <p className="text-gray-600">
          Check-in Date: <span className="font-medium">{checkInDate}</span>
        </p>
      </div>
      <div className="mb-2">
        <p className="text-gray-600">
          Check-out Date: <span className="font-medium">{checkOutDate}</span>
        </p>
      </div>
      <div className="mb-2">
        <p className="text-gray-600">
          Number of Guests: <span className="font-medium">{numberOfGuests}</span>
        </p>
      </div>
      <div className="mb-2">
        <p className="text-gray-600">
          Room Type: <span className="font-medium">{roomType}</span>
        </p>
      </div>
      <div>
        <p className="text-gray-600">
          Total Price: <span className="font-medium">₹{totalPrice}</span>
        </p>
      </div>
    </div>
  )
}

export default BookingSummary

