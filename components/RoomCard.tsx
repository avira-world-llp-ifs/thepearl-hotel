import type React from "react"

interface Room {
  id: string
  name: string
  imageUrl: string
  price: number
  description: string
}

interface RoomCardProps {
  room: Room
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src={room.imageUrl || "/placeholder.svg"} alt={room.name} />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{room.name}</h2>
        <p className="text-gray-600">{room.description}</p>
        <p className="text-lg font-bold">₹{room.price}/night</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Book Now</button>
      </div>
    </div>
  )
}

export default RoomCard

