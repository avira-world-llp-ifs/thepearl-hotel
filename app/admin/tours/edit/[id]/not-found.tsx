import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TourNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Tour Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The tour you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/admin/tours">Return to Tours</Link>
      </Button>
    </div>
  )
}

