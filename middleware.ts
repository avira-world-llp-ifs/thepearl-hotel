import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token and user role
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log("Middleware token:", token)
    const userRole = token?.role

    // Check if user is on the login page and already authenticated
    if (pathname === "/login" && token) {
      // Redirect based on role
      if (userRole === "ADMIN") {
        console.log("Admin already logged in, redirecting to /admin")
        return NextResponse.redirect(new URL("/admin", request.url))
      } else {
        console.log("User already logged in, redirecting to /dashboard")
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // Protected admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        console.log("No token, redirecting to login")
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url))
      }

      // Make sure we're checking for the correct role format
      if (userRole !== "ADMIN" && userRole !== "admin") {
        console.log("Not admin, redirecting to dashboard with access denied message")
        return NextResponse.redirect(new URL("/dashboard?error=access_denied", request.url))
      }

      console.log("Admin access granted")
    }

    // Protected user routes - redirect admins to admin dashboard
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        console.log("No token for dashboard, redirecting to login")
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url))
      }

      // If user is an admin, redirect to admin dashboard
      if (userRole === "ADMIN" || userRole === "admin") {
        console.log("Admin trying to access user dashboard, redirecting to admin dashboard")
        return NextResponse.redirect(new URL("/admin", request.url))
      }

      console.log("User access granted")
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error in the middleware, allow the request to continue
    // so the error can be handled by the application
    return NextResponse.next()
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/login", "/admin/:path*", "/dashboard/:path*"],
}

