import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default async function FavoritesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/dashboard/favorites")
  }

  // Placeholder for favorites data
  const favorites = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
        <p className="text-muted-foreground mt-2">Rooms and properties you've saved</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{/* Favorites would be mapped here */}</div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't saved any rooms or properties to your favorites yet.
            </p>
            <Button asChild>
              <a href="/rooms">Browse Rooms</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

