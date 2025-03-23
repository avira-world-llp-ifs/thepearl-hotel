import { facilityService } from "@/lib/db"
import { notFound } from "next/navigation"
import { EditFacilityForm } from "@/components/admin/edit-facility-form"

interface EditFacilityPageProps {
  params: {
    id: string
  }
}

export default async function EditFacilityPage({ params }: EditFacilityPageProps) {
  const facility = await facilityService.getById(params.id)

  if (!facility) {
    notFound()
  }

  return (
    <div className="md:pt-0 pt-10">
      <h1 className="text-3xl font-bold mb-6">Edit Facility</h1>
      <EditFacilityForm facility={facility} />
    </div>
  )
}

