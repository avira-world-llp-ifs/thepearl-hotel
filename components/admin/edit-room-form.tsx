"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface Category {
  _id: string
  name: string
  description: string
  basePrice: number
}

interface EditRoomFormProps {
  room: any // Using any type to accommodate MongoDB document
}

export function EditRoomForm({ room }: EditRoomFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: room.name || "",
    description: room.description || "",
    price: room.price?.toString() || "",
    capacity: room.capacity?.toString() || "",
    size: room.size?.toString() || "",
    categoryId: room.categoryId || "",
    amenities: room.amenities || ["Free Wi-Fi"],
    featured: room.featured || false,
  })
  const [newAmenity, setNewAmenity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [existingImages, setExistingImages] = useState<string[]>(room.images || [])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFetchingCategories, setIsFetchingCategories] = useState(true)
  const [newImageUrl, setNewImageUrl] = useState<string>("")

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load room categories. Please try again.")
      } finally {
        setIsFetchingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Update price when category changes
  useEffect(() => {
    if (formData.categoryId && formData.categoryId !== room.categoryId) {
      const selectedCategory = categories.find((cat) => cat._id === formData.categoryId)
      if (selectedCategory) {
        setFormData((prev) => ({
          ...prev,
          price: selectedCategory.basePrice.toString(),
        }))
      }
    }
  }, [formData.categoryId, categories, room.categoryId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }))
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => {
      const updatedImages = [...prev]
      updatedImages.splice(index, 1)
      return updatedImages
    })
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl || newImageUrl.trim() === "") return

    // Check if adding this URL would exceed the 5 image limit
    if (existingImages.length >= 5) {
      setError("You can only upload a maximum of 5 images")
      return
    }

    // Add the URL to existing images
    setExistingImages((prev) => [...prev, newImageUrl.trim()])
    setNewImageUrl("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      // Use only the existing images
      const allImageUrls = [...existingImages]

      // Log the data being sent for debugging
      console.log("Updating room data:", {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        capacity: Number.parseInt(formData.capacity),
        size: Number.parseInt(formData.size),
        categoryId: formData.categoryId || undefined,
        amenities: formData.amenities,
        featured: formData.featured,
        images: allImageUrls,
      })

      const response = await fetch(`/api/rooms/${room._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          capacity: Number.parseInt(formData.capacity),
          size: Number.parseInt(formData.size),
          categoryId: formData.categoryId || undefined,
          amenities: formData.amenities,
          featured: formData.featured,
          images: allImageUrls,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("API error response:", data)
        throw new Error(data.error || "Failed to update room")
      }

      console.log("Room updated successfully:", data)
      setSuccess("Room updated successfully!")

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/rooms")
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("Error updating room:", err)
      setError(err instanceof Error ? err.message : "An error occurred while updating the room. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const totalImages = existingImages.length
  const remainingSlots = 5 - totalImages

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Details</CardTitle>
        <CardDescription>Edit room information</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Deluxe King Room"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Room Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                disabled={isFetchingCategories}
              >
                <SelectTrigger id="categoryId">
                  <SelectValue
                    placeholder={
                      isFetchingCategories
                        ? "Loading categories..."
                        : categories.length === 0
                          ? "No categories available"
                          : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name} - Base Price: ${category.basePrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Night ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 199.99"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Guests)</Label>
              <Select
                value={formData.capacity}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, capacity: value }))}
              >
                <SelectTrigger id="capacity">
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Room Size (sq ft)</Label>
              <Input
                id="size"
                name="size"
                type="number"
                min="0"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., 400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the room..."
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Image URL Section */}
          <div className="space-y-2">
            <Label>Room Photos (Max 5)</Label>
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Existing Images */}
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <div className="relative h-24 w-32 rounded-md overflow-hidden border">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Room photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-90 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalImages} of 5 photos added. {remainingSlots} remaining.
            </p>
            {totalImages < 5 && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="imageUrl">Add Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl || ""}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrl || newImageUrl.trim() === ""}
                  >
                    Add URL
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Add images directly from URLs</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                  <span>{amenity}</span>
                  <button
                    type="button"
                    className="ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveAmenity(amenity)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add an amenity (e.g., Air Conditioning)"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddAmenity}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="featured" checked={formData.featured} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="featured">Featured Room</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

