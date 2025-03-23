"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Hotel, MessageSquare, Map, Settings, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  href?: string
  isActive?: boolean
  hasSubMenu?: boolean
  isOpen?: boolean
  onClick?: () => void
  subMenuItems?: {
    title: string
    href: string
  }[]
}

const SidebarItem = ({ icon, title, href, isActive, hasSubMenu, isOpen, onClick, subMenuItems }: SidebarItemProps) => {
  return (
    <div className="mb-2">
      {href && !hasSubMenu ? (
        <Link href={href}>
          <div
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            <div className="mr-2">{icon}</div>
            <div>{title}</div>
          </div>
        </Link>
      ) : (
        <div>
          <div
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
            onClick={onClick}
          >
            <div className="flex items-center">
              <div className="mr-2">{icon}</div>
              <div>{title}</div>
            </div>
            <div>{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</div>
          </div>
          {isOpen && subMenuItems && (
            <div className="ml-6 mt-1">
              {subMenuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-100">{item.title}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    enquiries: false,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 fixed left-0 top-0 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <div className="space-y-1">
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          title="Dashboard"
          href="/admin"
          isActive={pathname === "/admin"}
        />
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          title="Users"
          href="/admin/users"
          isActive={pathname === "/admin/users"}
        />
        <SidebarItem
          icon={<Hotel className="h-5 w-5" />}
          title="Rooms"
          href="/admin/rooms"
          isActive={pathname === "/admin/rooms"}
        />
        <SidebarItem
          icon={<Map className="h-5 w-5" />}
          title="Tours"
          href="/admin/tours"
          isActive={pathname === "/admin/tours"}
        />
        <SidebarItem
          icon={<MessageSquare className="h-5 w-5" />}
          title="Enquiries"
          hasSubMenu={true}
          isOpen={openMenus.enquiries}
          onClick={() => toggleMenu("enquiries")}
          isActive={pathname.includes("/admin/enquiries")}
          subMenuItems={[
            {
              title: "Room Enquiries (Read)",
              href: "/admin/enquiries/room/read",
            },
            {
              title: "Room Enquiries (Unread)",
              href: "/admin/enquiries/room/unread",
            },
            {
              title: "Tour Enquiries (Read)",
              href: "/admin/enquiries/tour/read",
            },
            {
              title: "Tour Enquiries (Unread)",
              href: "/admin/enquiries/tour/unread",
            },
          ]}
        />
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          title="Settings"
          href="/admin/settings"
          isActive={pathname === "/admin/settings"}
        />
      </div>
    </div>
  )
}

