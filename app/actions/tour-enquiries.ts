"use server"

import { connectToDatabase } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

export async function markAsRead(formData: FormData) {
  try {
    const id = formData.get("id") as string

    if (!id) {
      throw new Error("Enquiry ID is required")
    }

    const { db } = await connectToDatabase()

    await db
      .collection("tourEnquiries")
      .updateOne({ _id: new ObjectId(id) }, { $set: { isRead: true, updatedAt: new Date() } })

    revalidatePath(`/admin/tour-enquiries/${id}`)
    revalidatePath("/admin/tour-enquiries")

    return { success: true }
  } catch (error) {
    console.error("Error marking tour enquiry as read:", error)
    return { success: false, error: "Failed to mark enquiry as read" }
  }
}

