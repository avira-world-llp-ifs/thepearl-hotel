"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { AnimatedPearlLogo } from "./animated-pearl-logo"

export function SimpleHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")

  // Check authentication status client-side after mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const authRes = await fetch("/api/auth/status")
        const authData = await authRes.json()

        setIsLoggedIn(authData.authenticated)

        if (authData.authenticated) {
          // Check if user is admin
          const roleRes = await fetch("/api/auth/check-role")
          const roleData = await roleRes.json()
          setIsAdmin(roleData.isAdmin)
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }

    checkAuth()
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/rooms", label: "Rooms" },
    { href: "/gallery", label: "Gallery" },
    { href: "/tours", label: "Tour Packages" },
    { href: "/contact", label: "Contact" },
  ]

  // Determine dashboard link based on user role
  const dashboardLink = isAdmin ? "/admin" : "/dashboard"
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "Dashboard"

  return (
    <header className={`absolute top-0 left-0 w-full z-50 ${isDashboardOrAdmin ? "bg-white py-2" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 pb-4">
        <div className="flex items-center justify-between">
          {/* Animated Logo */}
          <AnimatedPearlLogo isDashboardOrAdmin={isDashboardOrAdmin} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={`${
                  pathname === link.href
                    ? "text-blue-500"
                    : isDashboardOrAdmin
                      ? "text-gray-700 hover:text-blue-500"
                      : "text-amber-500 hover:text-blue-500"
                } transition-colors text-sm font-medium`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href={dashboardLink}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${
                      isDashboardOrAdmin
                        ? "text-gray-700 hover:text-blue-500 border-gray-700 hover:border-blue-500"
                        : "text-amber-500 hover:text-blue-500 border-amber-500 hover:border-blue-500"
                    }`}
                  >
                    <User size={16} />
                    {dashboardLabel}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className={`flex items-center gap-2 ${
                    isDashboardOrAdmin
                      ? "text-gray-700 hover:text-blue-500"
                      : "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  }`}
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  size="sm"
                  className={`${
                    isDashboardOrAdmin ? "bg-gray-700 hover:bg-blue-500" : "bg-amber-500 hover:bg-blue-500"
                  } text-white`}
                >
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-amber-500 hover:text-blue-500"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-amber-500/20">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                    pathname === link.href ? "text-blue-500" : "text-amber-500"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardLink}
                    className="text-sm font-medium text-amber-500 hover:text-blue-500 flex items-center gap-2"
                  >
                    <User size={16} />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-sm font-medium text-amber-500 hover:text-blue-500">
                  Login / Register
                </Link>
              )}

              <div className="pt-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

