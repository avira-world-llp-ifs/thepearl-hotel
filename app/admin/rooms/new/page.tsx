"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, X, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface Category {
  _id: string
  name: string
  description: string
  basePrice: number
}

export default function AddRoomPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "2", // Default to 2 guests
    size: "",
    categoryId: "",
    amenities: ["Free Wi-Fi"],
    featured: false,
  })
  const [newAmenity, setNewAmenity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFetchingCategories, setIsFetchingCategories] = useState(true)

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
    if (formData.categoryId) {
      const selectedCategory = categories.find((cat) => cat._id === formData.categoryId)
      if (selectedCategory) {
        setFormData((prev) => ({
          ...prev,
          price: selectedCategory.basePrice.toString(),
        }))
      }
    }
  }, [formData.categoryId, categories])

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Check if adding these files would exceed the 5 image limit
    if (images.length + files.length > 5) {
      setError("You can only upload a maximum of 5 images")
      return
    }

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...newImages])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Room name is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }
    if (!formData.price) {
      setError("Price is required")
      return false
    }
    if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) < 0) {
      setError("Price must be a valid positive number")
      return false
    }
    if (!formData.capacity) {
      setError("Capacity is required")
      return false
    }
    if (!formData.size) {
      setError("Room size is required")
      return false
    }
    if (isNaN(Number.parseInt(formData.size)) || Number.parseInt(formData.size) < 0) {
      setError("Size must be a valid positive number")
      return false
    }
    return true
  }

  const uploadImages = async () => {
    if (images.length === 0) return []

    const imageUrls: string[] = []

    // In a real application, you would upload these to a storage service
    // For this demo, we'll use placeholder URLs with the image names
    for (const image of images) {
      // Simulate an upload delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create a placeholder URL with the image name
      const imageUrl = `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(image.file.name)}`
      imageUrls.push(imageUrl)
    }

    return imageUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Upload images first
      const imageUrls = await uploadImages()

      // Prepare data with proper type conversion
      const roomData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        capacity: Number.parseInt(formData.capacity),
        size: Number.parseInt(formData.size),
        categoryId: formData.categoryId || undefined,
        amenities: formData.amenities,
        featured: formData.featured,
        images: imageUrls, // Add the image URLs
      }

      // Log the data being sent for debugging
      console.log("Submitting room data:", roomData)

      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("API error response:", data)
        throw new Error(data.error || data.details || "Failed to create room")
      }

      console.log("Room created successfully:", data)
      setSuccess("Room created successfully!")

      // Reset form after successful creation
      setFormData({
        name: "",
        description: "",
        price: "",
        capacity: "2",
        size: "",
        categoryId: "",
        amenities: ["Free Wi-Fi"],
        featured: false,
      })
      setImages([])

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/rooms")
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("Error creating room:", err)
      setError(err instanceof Error ? err.message : "An error occurred while creating the room. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="md:pt-0 pt-10">
      <h1 className="text-3xl font-bold mb-6">Add New Room</h1>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>Add a new room to your hotel inventory</CardDescription>
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
                  disabled={isFetchingCategories || categories.length === 0}
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
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name} - Base Price: ₹{category.basePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && !isFetchingCategories && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No categories found.{" "}
                    <a href="/admin/categories/new" className="text-primary hover:underline">
                      Create a category
                    </a>{" "}
                    first.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Night (₹)</Label>
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
                {formData.categoryId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Base price from selected category. You can adjust as needed.
                  </p>
                )}
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

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label>Room Photos (Max 5)</Label>
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-24 w-32 rounded-md overflow-hidden border">
                      <Image
                        src={image.preview || "/placeholder.svg"}
                        alt={`Room photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-90 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <div
                    className="h-24 w-32 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      multiple={images.length < 4} // Allow multiple only if we can add more than 1
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {images.length} of 5 photos added. {5 - images.length} remaining.
              </p>
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

