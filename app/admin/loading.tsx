import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardLoading() {
  return (
    <div className="w-full">
      <Skeleton className="h-10 w-48 mb-6" />
      <Skeleton className="h-5 w-64 mb-6" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Manage all bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-9 w-32" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-9 w-32" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rooms</CardTitle>
            <CardDescription>Manage room inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-9 w-32" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

