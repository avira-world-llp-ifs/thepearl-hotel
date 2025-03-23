"use server"

import { revalidatePath } from "next/cache"
import { settingsService } from "@/lib/db"

export async function updateSettings(section: string, data: any) {
  try {
    const result = await settingsService.update(section, data)

    // Revalidate paths that might use these settings
    revalidatePath("/")
    revalidatePath("/admin/settings")
    revalidatePath("/contact")

    return { success: true, message: `${section} settings updated successfully` }
  } catch (error) {
    console.error(`Error updating ${section} settings:`, error)
    return { success: false, message: error.message || `Failed to update ${section} settings` }
  }
}

export async function getSettings() {
  try {
    const settings = await settingsService.get()
    return { success: true, settings }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return { success: false, message: error.message || "Failed to fetch settings" }
  }
}

