import { redirect } from "next/navigation"

export default function UnreadEnquiriesRedirect() {
  redirect("/admin/room-enquiries")
}

