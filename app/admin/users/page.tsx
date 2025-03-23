import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { userService, bookingService } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Eye, UserPlus } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await userService.getAll()

  // Get booking counts for each user
  const userBookingCounts = await Promise.all(
    users.map(async (user) => {
      const bookings = await bookingService.getByUserId(user._id.toString())
      return {
        ...user,
        bookingCount: Array.isArray(bookings) ? bookings.length : 0,
      }
    }),
  )

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Bookings</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userBookingCounts.map((user) => (
                <tr key={user._id.toString()} className="border-b">
                  <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.bookingCount}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/users/${user._id.toString()}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

