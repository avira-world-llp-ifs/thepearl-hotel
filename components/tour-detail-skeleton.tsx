import { Skeleton } from "@/components/ui/skeleton"

export default function TourDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <Skeleton className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl" />

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tour Details Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            <Skeleton className="h-8 w-48 mt-6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form Skeleton */}
        <div>
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

