"use client"

import type React from "react"
import { useEffect } from "react"
import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react"

// Session check component to verify session on client-side
function SessionCheck() {
  const { data: session, status } = useSession()

  useEffect(() => {
    // Log session status for debugging
    if (status === "authenticated") {
      console.log("User authenticated:", session?.user?.email)
    } else if (status === "unauthenticated") {
      console.log("User not authenticated")
    }

    // You could also refresh the session or perform additional checks here
  }, [session, status])

  return null
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SessionCheck />
      {children}
    </NextAuthSessionProvider>
  )
}

