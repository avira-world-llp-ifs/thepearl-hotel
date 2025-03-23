"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UseAuthOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = false, requireAdmin = false, redirectTo = "/login" } = options
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = status === "authenticated"
  const isAdmin = session?.user?.role === "admin"

  useEffect(() => {
    // Wait for session check to complete
    if (status === "loading") return

    setIsLoading(false)

    // Handle authentication requirements
    if (requireAuth && !isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Handle admin requirements
    if (requireAdmin && (!isAuthenticated || !isAdmin)) {
      router.push(isAuthenticated ? "/dashboard" : "/login")
      return
    }
  }, [status, isAuthenticated, isAdmin, requireAuth, requireAdmin, redirectTo, router])

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    isAdmin,
    user: session?.user,
  }
}

