import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { roomService } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { Pencil, ArrowLeft, Check } from "lucide-react"
import { DeleteRoomButton } from "@/components/admin/delete-room-button"
import { Input } from "@/components/ui/input"

interface RoomDetailPageProps {
  params: {
    id: string
  }
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const room = await roomService.getById(params.id)

  if (!room) {
    notFound()
  }

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/rooms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{room.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Main Image */}
              {room.images && room.images.length > 0 ? (
                <div className="relative h-[300px] mb-6 rounded-lg overflow-hidden">
                  <Image src={room.images[0] || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="relative h-[300px] mb-6 rounded-lg overflow-hidden">
                  <Image src="/placeholder.svg?height=600&width=1200" alt={room.name} fill className="object-cover" />
                </div>
              )}

              {/* Additional Images */}
              {room.images && room.images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {room.images.slice(1).map((image: string, index: number) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${room.name} detail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Price</p>
                  <p className="text-lg font-bold">₹{formatPrice(room.price)}</p>
                  <p className="text-sm text-muted-foreground">per night</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Capacity</p>
                  <p className="text-lg font-bold">{room.capacity} Guests</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Size</p>
                  <p className="text-lg font-bold">{room.size} sq ft</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{room.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity: string) => (
                    <div key={amenity} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                      <Check className="h-3 w-3 mr-1 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Room Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Featured</p>
                  <Badge variant={room.featured ? "default" : "outline"}>{room.featured ? "Yes" : "No"}</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
                  <p>{new Date(room.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                  <p>{new Date(room.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Add Image URL</p>
                  <form className="flex gap-2" action={`/api/rooms/${room._id}/add-image`} method="POST">
                    <Input name="imageUrl" placeholder="https://example.com/image.jpg" className="flex-1" />
                    <Button type="submit" size="sm">
                      Add
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-1">Add an image URL to the room gallery</p>
                </div>

                <div className="pt-4 border-t flex flex-col gap-2">
                  <Button asChild>
                    <Link href={`/admin/rooms/${room._id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Room
                    </Link>
                  </Button>
                  <DeleteRoomButton id={room._id.toString()} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

