import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
      <p className="text-muted-foreground mb-6">The user you are looking for does not exist or has been removed.</p>
      <Button asChild>
        <Link href="/admin/users">Back to Users</Link>
      </Button>
    </div>
  )
}

