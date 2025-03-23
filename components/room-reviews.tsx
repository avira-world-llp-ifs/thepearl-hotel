import { reviewService, userService } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Star } from "lucide-react"

interface RoomReviewsProps {
  roomId: string
}

export default async function RoomReviews({ roomId }: RoomReviewsProps) {
  const reviews = await reviewService.getByRoomId(roomId)

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <p className="text-muted-foreground">No reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      <div className="space-y-6">
        {reviews.map(async (review) => {
          const user = await userService.getById(review.userId)

          return (
            <div key={review._id.toString()} className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="font-semibold text-primary">{user?.name?.charAt(0) || "U"}</span>
                  </div>
                  <div>
                    <p className="font-medium">{user?.name || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center bg-muted px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

