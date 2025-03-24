import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { roomService } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { Plus, Pencil } from "lucide-react"
import { DeleteRoomButton } from "@/components/admin/delete-room-button"

export default async function AdminRoomsPage() {
  const rooms = await roomService.getAll()

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Button asChild>
          <Link href="/admin/rooms/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Room
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        {!rooms || rooms.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No rooms found. Add your first room to get started.</p>
            <Button asChild>
              <Link href="/admin/rooms/new">Add Room</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Capacity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Featured</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id.toString()} className="border-b">
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-20 rounded overflow-hidden">
                        <Image
                          src={
                            room.images && room.images.length > 0 && room.images[0].startsWith("http")
                              ? room.images[0]
                              : room.images && room.images.length > 0
                                ? room.images[0]
                                : "/placeholder.svg?height=100&width=150"
                          }
                          alt={room.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{room.name}</td>
                    <td className="px-4 py-3 text-sm">{formatPrice(room.price, "₹")}</td>
                    <td className="px-4 py-3 text-sm">{room.capacity} Guests</td>
                    <td className="px-4 py-3 text-sm">{room.size} sq ft</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={room.featured ? "default" : "outline"}>{room.featured ? "Yes" : "No"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/rooms/${room._id.toString()}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeleteRoomButton id={room._id.toString()} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

