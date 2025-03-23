"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import bcrypt from "bcryptjs"
import User from "@/lib/db/models/User"
import dbConnect from "@/lib/db/dbConnect"

// Schema for profile update
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

// Schema for password update
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

export async function updatePersonalInfo(formData: FormData) {
  try {
    // Get current user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, message: "You must be logged in" }
    }

    // Validate input
    const name = formData.get("name") as string
    const validatedData = profileSchema.parse({ name })

    // Connect to database
    await dbConnect()

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { name: validatedData.name },
      { new: true },
    )

    if (!updatedUser) {
      return { success: false, message: "User not found" }
    }

    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    console.error("Profile update error:", error)
    return { success: false, message: "Failed to update profile" }
  }
}

// Add the updateProfile function that was expected by the components
export async function updateProfile(formData: FormData) {
  return updatePersonalInfo(formData)
}

export async function updatePassword(formData: FormData) {
  try {
    // Get form data
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string

    // Validate input
    const validatedData = passwordSchema.parse({
      currentPassword,
      newPassword,
    })

    // Get current user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, message: "You must be logged in" }
    }

    // Connect to database
    await dbConnect()

    // Find user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password)

    if (!isPasswordValid) {
      return { success: false, message: "Current password is incorrect" }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)

    // Update password
    user.password = hashedPassword
    await user.save()

    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    console.error("Password update error:", error)
    return { success: false, message: "Failed to update password" }
  }
}

