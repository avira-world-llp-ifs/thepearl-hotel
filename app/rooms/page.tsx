import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { roomService } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { Star, Users, SquareIcon as SquareFeet } from "lucide-react"
import RoomFilter from "@/components/room-filter"

// Change the revalidate value to 0 to fetch fresh data on each request
export const revalidate = 0 // Revalidate on every request

export default async function RoomsPage() {
  const rooms = await roomService.getAll()

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Our Rooms</h1>
          <p className="text-muted-foreground">Choose from our selection of luxurious rooms and suites.</p>
        </div>
        <RoomFilter />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(rooms) &&
          rooms.map((room) => (
            <div
              key={room._id.toString()}
              className="bg-background rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-64">
                {room.images && room.images.length > 0 ? (
                  <Image
                    src={room.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"}
                    alt={room.name}
                    fill
                    className="object-cover"
                    // Remove the onError handler that was causing issues
                  />
                ) : (
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{room.name}</h2>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm font-medium">4.8</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2">{room.description}</p>

                <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center">
                    <SquareFeet className="h-4 w-4 mr-1" />
                    <span>{room.size} sq ft</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="bg-muted text-xs px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="bg-muted text-xs px-2 py-1 rounded-full">+{room.amenities.length - 3} more</span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold">{formatPrice(room.price).replace("$", "₹")}</span>
                    <span className="text-muted-foreground text-sm"> / night</span>
                  </div>
                  <Button asChild>
                    <Link href={`/rooms/${room._id.toString()}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

