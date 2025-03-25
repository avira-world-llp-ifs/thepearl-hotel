"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { BarChart3, Bed, BookOpen, Building, Home, Map, MessageSquare, Settings, Users, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const adminRoutes = [
    {
      href: "/admin",
      icon: Home,
      label: "Overview",
      color: "text-emerald-500",
    },
    {
      href: "/admin/bookings",
      icon: BookOpen,
      label: "Bookings",
      color: "text-orange-500",
    },
    {
      href: "/admin/rooms",
      icon: Bed,
      label: "Rooms",
      color: "text-rose-500",
    },
    {
      href: "/admin/room-enquiries",
      icon: MessageSquare,
      label: "Room Enquiries",
      color: "text-yellow-500",
    },
    {
      href: "/admin/tour-enquiries",
      icon: Map,
      label: "Tour Enquiries",
      color: "text-blue-500",
    },
    {
      href: "/admin/general-enquiries",
      icon: MessageSquare,
      label: "General Enquiries",
      color: "text-purple-500",
    },
    {
      href: "/admin/tours",
      icon: Building,
      label: "Tours",
      color: "text-indigo-500",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
      color: "text-zinc-500",
    },
    {
      href: "/admin/reports",
      icon: BarChart3,
      label: "Reports",
      color: "text-pink-500",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      color: "text-stone-500",
    },
  ]

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-primary-foreground p-2 rounded-md shadow-md"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        h-full border-r flex flex-col overflow-y-auto bg-white dark:bg-gray-950 shadow-sm
        md:static md:block
        ${isMobileMenuOpen ? "fixed inset-y-0 left-0 z-40 w-64 block" : "hidden md:block"}
      `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold tracking-tight">
                Hotel<span className="text-primary">Admin</span>
              </h1>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {adminRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-sm font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all",
                pathname === route.href || pathname.startsWith(`${route.href}/`)
                  ? "text-primary border-r-4 border-primary bg-gray-50 dark:bg-gray-900"
                  : "text-gray-700 dark:text-gray-300",
              )}
            >
              <div className="flex items-center gap-x-2 py-1">
                <route.icon className={cn("h-5 w-5", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

