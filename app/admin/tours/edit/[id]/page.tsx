import { notFound } from "next/navigation"
import { TourForm } from "@/components/admin/tour-form"

export const metadata = {
  title: "Edit Tour Package | Admin Dashboard",
  description: "Edit tour package details",
}

async function getTour(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://v0-hotelbooking-hw.vercel.app"
    const res = await fetch(`${baseUrl}/api/tours/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch tour: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching tour:", error)
    throw error
  }
}

export default async function EditTourPage({ params }: { params: { id: string } }) {
  const data = await getTour(params.id)

  if (!data || !data.tour) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Tour Package</h1>
        <p className="text-muted-foreground">Update tour details, itinerary, and availability.</p>
      </div>

      <TourForm tour={data.tour} />
    </div>
  )
}

