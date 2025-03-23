"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/")
  }

  return (
    <div className="w-64 bg-white shadow-md p-4 h-full min-h-screen">
      <h2 className="text-xl font-semibold mb-6">User Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard">
              <span
                className={`flex items-center p-2 rounded ${
                  isActive("/dashboard") && !isActive("/dashboard/bookings") && !isActive("/dashboard/profile")
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/bookings">
              <span
                className={`flex items-center p-2 rounded ${
                  isActive("/dashboard/bookings") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                My Bookings
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/profile">
              <span
                className={`flex items-center p-2 rounded ${
                  isActive("/dashboard/profile") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </span>
            </Link>
          </li>
          <li className="mt-6">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center w-full p-2 rounded hover:bg-muted"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

