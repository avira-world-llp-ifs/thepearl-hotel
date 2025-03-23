"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bed, BookOpen, Building, Home, Map, MessageSquare, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  console.log("Current pathname:", pathname) // Add logging to debug

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
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white dark:bg-gray-950 shadow-sm">
      <div className="p-6">
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-tight">
            Hotel<span className="text-primary">Admin</span>
          </h1>
        </Link>
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
            onClick={(e) => {
              console.log("Clicked on:", route.href) // Add logging to debug
            }}
          >
            <div className="flex items-center gap-x-2 py-1">
              <route.icon className={cn("h-5 w-5", route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

