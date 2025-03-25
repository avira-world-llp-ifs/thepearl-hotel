"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function AuthStatus() {
  const session = useSession()
  const [apiStatus, setApiStatus] = useState({ loading: true, data: null })

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch("/api/auth/status")
        const data = await res.json()
        setApiStatus({ loading: false, data })
      } catch (error) {
        console.error("Error checking API status:", error)
        setApiStatus({ loading: false, data: { error: "Failed to fetch" } })
      }
    }

    checkApiStatus()
  }, [])

  if (typeof window === "undefined") {
    return null // Don't render during SSR
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs overflow-auto">
      <h3 className="font-bold mb-2">Auth Debug:</h3>
      <p>useSession status: {session.status}</p>
      <p>Logged in: {session.status === "authenticated" ? "Yes" : "No"}</p>
      <p>User: {session.data?.user?.name || "None"}</p>
      <p>Role: {session.data?.user?.role || "None"}</p>

      <h3 className="font-bold mt-3 mb-2">API Status:</h3>
      <p>Loading: {apiStatus.loading ? "Yes" : "No"}</p>
      <pre>{JSON.stringify(apiStatus.data, null, 2)}</pre>

      <button
        onClick={() => console.log("Full session:", session)}
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
      >
        Log to Console
      </button>
    </div>
  )
}

