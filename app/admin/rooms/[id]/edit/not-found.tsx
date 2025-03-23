import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RoomNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">Room Not Found</h1>
      <p className="text-muted-foreground mb-6">The room you are looking for does not exist or has been removed.</p>
      <Button asChild>
        <Link href="/admin/rooms">Back to Rooms</Link>
      </Button>
    </div>
  )
}

