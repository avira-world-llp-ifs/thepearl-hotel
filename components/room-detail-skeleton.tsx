import { Skeleton } from "@/components/ui/skeleton"

export default function RoomDetailSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-4 w-2/3 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full mb-4" />
          <div className="grid grid-cols-4 gap-2 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>

          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />

          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}

