"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || ""
  const errorParam = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (status === "authenticated" && session?.user && !isRedirecting) {
      setIsRedirecting(true)
      console.log("User is authenticated, redirecting based on role or callback URL")
      console.log("User role:", session.user.role)

      // If there's a callback URL, use it (but only if the user has permission)
      if (callbackUrl) {
        // Check if the callback URL is for an admin page but the user is not an admin
        if (callbackUrl.startsWith("/admin") && session.user.role !== "ADMIN" && session.user.role !== "admin") {
          console.log("User tried to access admin page but is not an admin, redirecting to dashboard")
          router.push("/dashboard")
          return
        }

        console.log(`Redirecting to callback URL: ${callbackUrl}`)
        router.push(callbackUrl)
        return
      }

      // Otherwise, redirect based on role
      if (session.user.role === "ADMIN" || session.user.role === "admin") {
        console.log("Admin user detected, redirecting to /admin")
        router.push("/admin")
      } else {
        console.log("Regular user detected, redirecting to /dashboard")
        router.push("/dashboard")
      }
    }
  }, [session, status, router, callbackUrl, isRedirecting])

  // Set error message based on URL parameter
  useEffect(() => {
    if (errorParam === "CredentialsSignin") {
      setError("Invalid email or password")
    } else if (errorParam === "access_denied") {
      setError("You don't have permission to access that area")
    } else if (errorParam) {
      setError("An error occurred during sign in")
    }
  }, [errorParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Use NextAuth's signIn function
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error)
        setIsLoading(false)
        return
      }

      // Successful login - get the user data to check role
      if (result?.ok) {
        setIsRedirecting(true)

        // We need to fetch the session to get the user role
        const response = await fetch("/api/auth/session")
        const sessionData = await response.json()
        console.log("Session data after login:", sessionData)

        // Check if the callback URL is for an admin page but the user is not an admin
        if (
          callbackUrl &&
          callbackUrl.startsWith("/admin") &&
          sessionData?.user?.role !== "ADMIN" &&
          sessionData?.user?.role !== "admin"
        ) {
          console.log("User tried to access admin page but is not an admin, redirecting to dashboard")
          window.location.href = "/dashboard"
          return
        }

        // Force a hard redirect based on role or callback URL
        if (callbackUrl) {
          window.location.href = callbackUrl
        } else if (sessionData?.user?.role === "ADMIN" || sessionData?.user?.role === "admin") {
          console.log("Admin user detected, redirecting to /admin")
          window.location.href = "/admin"
        } else {
          console.log("Regular user detected, redirecting to /dashboard")
          window.location.href = "/dashboard"
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
              {isLoading ? "Logging in..." : isRedirecting ? "Redirecting..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

