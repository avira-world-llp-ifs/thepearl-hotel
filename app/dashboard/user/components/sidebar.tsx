"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const Sidebar = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="w-64 bg-white shadow-md p-4 h-screen">
      <h2 className="text-xl font-semibold mb-6">User Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard/user">
              <span
                className={`block p-2 rounded ${
                  isActive("/dashboard/user") ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/user/bookings">
              <span
                className={`block p-2 rounded ${
                  isActive("/dashboard/user/bookings") ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                My Bookings
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/user/profile">
              <span
                className={`block p-2 rounded ${
                  isActive("/dashboard/user/profile") ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                Profile
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar

