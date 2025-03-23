import type React from "react"

interface RoomCardProps {
  title: string
  imageUrl: string
  price: number
  description: string
}

const RoomCard: React.FC<RoomCardProps> = ({ title, imageUrl, price, description }) => {
  return (
    <div className="room-card">
      <img src={imageUrl || "/placeholder.svg"} alt={title} className="room-image" />
      <div className="room-details">
        <h3 className="room-title">{title}</h3>
        <p className="room-price">Price: ₹{price}</p>
        <p className="room-description">{description}</p>
      </div>
    </div>
  )
}

export default RoomCard

