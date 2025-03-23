import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TourNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Tour Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the tour you're looking for. It may have been removed or the URL might be incorrect.
      </p>
      <div className="flex gap-4">
        <Link href="/tours">
          <Button>Browse All Tours</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}

