import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import AdminSidebar from "@/components/admin/sidebar"
import { LayoutTransition } from "@/components/layout-transition"

export const dynamic = "force-dynamic" // Disable caching for this layout

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      redirect("/login?callbackUrl=/admin")
    }

    // Check for both uppercase and lowercase "admin" to handle potential inconsistencies
    if (session.user.role !== "ADMIN" && session.user.role !== "admin") {
      redirect("/dashboard?error=access_denied")
    }

    return (
      <LayoutTransition>
        <div className="flex flex-col md:flex-row min-h-screen">
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <AdminSidebar />
          </div>
          <main className="flex-1 p-4 md:p-6 lg:p-8 w-full overflow-auto">
            <div className="pt-20 md:pt-10 pb-4">{children}</div>
          </main>
        </div>
      </LayoutTransition>
    )
  } catch (error) {
    console.error("Error in admin layout:", error)
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

