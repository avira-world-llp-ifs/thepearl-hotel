import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Room Enquiries | Admin Dashboard",
  description: "Manage room enquiries",
}

export default function RoomEnquiriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

