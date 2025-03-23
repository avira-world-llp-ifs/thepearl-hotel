"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth({
    requireAuth,
    requireAdmin,
    redirectTo,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Authentication check passed, render children
  if (requireAuth && isAuthenticated && (!requireAdmin || isAdmin)) {
    return <>{children}</>
  }

  // This shouldn't normally render as the useAuth hook should redirect
  return null
}

