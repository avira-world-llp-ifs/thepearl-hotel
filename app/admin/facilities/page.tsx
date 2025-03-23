import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Pencil } from "lucide-react"
import { facilityService } from "@/lib/db"
import Image from "next/image"
import { DeleteFacilityButton } from "@/components/admin/delete-facility-button"

export default async function ManageFacilitiesPage() {
  const facilities = await facilityService.getAll()

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Facilities</h1>
        <Button asChild>
          <Link href="/admin/facilities/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Facility
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        {!facilities || facilities.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No facilities found. Add your first facility to get started.</p>
            <Button asChild>
              <Link href="/admin/facilities/new">Add Facility</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Icon</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((facility) => (
                  <tr key={facility._id.toString()} className="border-b">
                    <td className="px-4 py-3 text-sm">{facility.name}</td>
                    <td className="px-4 py-3 text-sm">{facility.description}</td>
                    <td className="px-4 py-3 text-sm">
                      {facility.icon ? (
                        facility.iconType === "image" ? (
                          <div className="relative h-8 w-8">
                            <Image
                              src={facility.icon || "/placeholder.svg"}
                              alt={facility.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          facility.icon
                        )
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/facilities/${facility._id.toString()}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeleteFacilityButton id={facility._id.toString()} />
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

