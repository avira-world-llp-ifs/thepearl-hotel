"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function AuthDebugPage() {
  const { data: session, status } = useSession()
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

  return (
    <div className="container mx-auto p-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Client-Side Session (useSession)</h2>
          <div className="mb-4">
            <p>
              <strong>Status:</strong> {status}
            </p>
            <p>
              <strong>Logged in:</strong> {status === "authenticated" ? "Yes" : "No"}
            </p>
            {session?.user && (
              <>
                <p>
                  <strong>User:</strong> {session.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {session.user.email}
                </p>
                <p>
                  <strong>Role:</strong> {session.user.role || "Not set"}
                </p>
              </>
            )}
          </div>

          <div className="space-x-4">
            {status === "authenticated" ? (
              <Button onClick={() => signOut()}>Sign Out</Button>
            ) : (
              <Button onClick={() => signIn()}>Sign In</Button>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Full Session Data:</h3>
            <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Server-Side Session (API)</h2>
          <div className="mb-4">
            <p>
              <strong>Loading:</strong> {apiStatus.loading ? "Yes" : "No"}
            </p>
            {!apiStatus.loading && apiStatus.data && (
              <>
                <p>
                  <strong>Authenticated:</strong> {apiStatus.data.authenticated ? "Yes" : "No"}
                </p>
                {apiStatus.data.user && (
                  <>
                    <p>
                      <strong>User:</strong> {apiStatus.data.user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {apiStatus.data.user.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {apiStatus.data.user.role || "Not set"}
                    </p>
                  </>
                )}
              </>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Full API Response:</h3>
            <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(apiStatus.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

