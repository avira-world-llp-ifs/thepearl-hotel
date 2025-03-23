import { roomService } from "@/lib/db"
import { notFound } from "next/navigation"
import { EditRoomForm } from "@/components/admin/edit-room-form"

interface EditRoomPageProps {
  params: {
    id: string
  }
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const room = await roomService.getById(params.id)

  if (!room) {
    notFound()
  }

  return (
    <div className="md:pt-0 pt-10">
      <h1 className="text-3xl font-bold mb-6">Edit Room</h1>
      <EditRoomForm room={room} />
    </div>
  )
}

