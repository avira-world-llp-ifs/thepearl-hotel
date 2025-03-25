"use client"

import { useSession } from "next-auth/react"

export function SessionTest() {
  const { data: session, status } = useSession()

  if (typeof window === "undefined") {
    return null // Don't render during SSR
  }

  return (
    <div className="fixed top-20 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs overflow-auto">
      <h3 className="font-bold mb-2">Session Test:</h3>
      <p>Status: {status}</p>
      <p>User: {session?.user?.name || "None"}</p>
      <p>Email: {session?.user?.email || "None"}</p>
      <p>Role: {session?.user?.role || "None"}</p>
      <pre className="mt-2 text-[10px] max-h-40 overflow-auto">{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}

