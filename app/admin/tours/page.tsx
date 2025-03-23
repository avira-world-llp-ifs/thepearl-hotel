import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AdminToursList from "@/components/admin/tours-list"

export const metadata = {
  title: "Tour Packages Management | Admin Dashboard",
  description: "Manage tour packages for your hotel booking website",
}

export default function AdminToursPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tour Packages</h1>
          <p className="text-muted-foreground">Manage tour packages, itineraries, and availability.</p>
        </div>
        <Button asChild>
          <Link href="/admin/tours/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Tour
          </Link>
        </Button>
      </div>

      <AdminToursList />
    </div>
  )
}

