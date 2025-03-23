import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
      <p className="text-muted-foreground mb-6">The category you are looking for does not exist or has been removed.</p>
      <Button asChild>
        <Link href="/admin/categories">Back to Categories</Link>
      </Button>
    </div>
  )
}

