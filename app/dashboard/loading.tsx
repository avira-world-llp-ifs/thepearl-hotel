import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, Heart, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-3/4 max-w-[300px]" />
        <Skeleton className="h-5 w-full max-w-[450px] mt-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Bookings</CardTitle>
            <CardDescription>View and manage your current and past bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CalendarClock className="h-8 w-8 text-muted mr-2" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Button disabled>View All</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Favorites</CardTitle>
            <CardDescription>Rooms and properties you've saved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-muted mr-2" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Button disabled>View All</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Reviews</CardTitle>
            <CardDescription>Reviews you've left for properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-muted mr-2" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Button disabled>View All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

