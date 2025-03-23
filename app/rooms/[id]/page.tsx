import { Suspense } from "react"
import { notFound } from "next/navigation"
import { roomService } from "@/lib/db"
import RoomDetail from "@/components/room-detail"
import RoomDetailSkeleton from "@/components/room-detail-skeleton"

// Add revalidation to avoid dynamic server usage
export const revalidate = 3600 // Revalidate every hour

export default async function RoomPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<RoomDetailSkeleton />}>
      <RoomDetailContent id={params.id} />
    </Suspense>
  )
}

async function RoomDetailContent({ id }: { id: string }) {
  const room = await roomService.getById(id)

  if (!room) {
    notFound()
  }

  return <RoomDetail room={room} />
}

