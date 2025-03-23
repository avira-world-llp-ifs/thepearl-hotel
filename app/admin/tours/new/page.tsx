import type { Metadata } from "next"
import { TourForm } from "@/components/admin/tour-form"

export const metadata: Metadata = {
  title: "Add New Tour | Admin Dashboard",
  description: "Create a new tour package for your hotel",
}

export default function NewTourPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Tour Package</h1>
      <TourForm />
    </div>
  )
}

