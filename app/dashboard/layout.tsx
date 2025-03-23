import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardSidebar from "@/components/dashboard/sidebar"

export const dynamic = "force-dynamic" // Disable caching for this layout

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      redirect("/login?callbackUrl=/dashboard")
    }

    // If user is an admin, redirect to admin dashboard
    if (session.user.role === "ADMIN" || session.user.role === "admin") {
      redirect("/admin")
    }

    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-64 md:w-72 flex-shrink-0">
          <DashboardSidebar />
        </div>
        <main className="flex-1 p-4 md:p-8 w-full overflow-auto">{children}</main>
      </div>
    )
  } catch (error) {
    console.error("Error in dashboard layout:", error)
    // Return a simple error page instead of redirecting to avoid potential redirect loops
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">There was an error loading this page.</p>
          <a href="/login" className="text-blue-600 hover:underline">
            Return to login
          </a>
        </div>
      </div>
    )
  }
}

