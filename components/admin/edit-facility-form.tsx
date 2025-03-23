"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react"
import Image from "next/image"

interface EditFacilityFormProps {
  facility: any // Using any type to accommodate MongoDB document
}

export function EditFacilityForm({ facility }: EditFacilityFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(facility.name || "")
  const [description, setDescription] = useState(facility.description || "")
  const [iconText, setIconText] = useState(facility.iconType === "text" ? facility.icon : "")
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(facility.iconType === "image" ? facility.icon : null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIconFile(file)
    setIconPreview(URL.createObjectURL(file))
    setIconText("") // Clear text icon when uploading an image

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveIcon = () => {
    if (iconPreview) {
      URL.revokeObjectURL(iconPreview)
    }
    setIconFile(null)
    setIconPreview(null)
  }

  const uploadIcon = async () => {
    if (!iconFile) return null

    // In a real application, you would upload this to a storage service
    // For this demo, we'll use a placeholder URL with the icon name
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate upload delay

    // Create a placeholder URL with the icon name
    return `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(iconFile.name)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      // Upload icon if available
      let iconUrl = null
      let iconType = ""

      if (iconFile) {
        iconUrl = await uploadIcon()
        iconType = "image"
      } else if (iconText) {
        iconUrl = iconText
        iconType = "text"
      } else if (iconPreview) {
        // Keep existing image
        iconUrl = facility.icon
        iconType = "image"
      }

      const facilityData = {
        name,
        description,
        icon: iconUrl,
        iconType,
      }

      console.log("Updating facility data:", facilityData)

      const response = await fetch(`/api/facilities/${facility._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facilityData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("API error response:", data)
        throw new Error(data.error || "Failed to update facility")
      }

      console.log("Facility updated successfully:", data)
      setSuccess("Facility updated successfully!")

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/facilities")
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("Error updating facility:", err)
      setError(err instanceof Error ? err.message : "An error occurred while updating the facility. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (iconPreview && iconFile) {
        URL.revokeObjectURL(iconPreview)
      }
    }
  }, [iconPreview, iconFile])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Facility</CardTitle>
        <CardDescription>Update facility information</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="name">Facility Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Free Wi-Fi, Swimming Pool"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the facility..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Facility Icon</Label>

            {/* Icon Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iconText" className="text-sm text-muted-foreground mb-2 block">
                  Option 1: Enter icon name or URL
                </Label>
                <Input
                  id="iconText"
                  value={iconText}
                  onChange={(e) => {
                    setIconText(e.target.value)
                    if (e.target.value) {
                      handleRemoveIcon() // Remove image icon if text is entered
                    }
                  }}
                  placeholder="Icon name or URL"
                  disabled={!!iconFile || !!iconPreview}
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Option 2: Upload icon image</Label>
                <div className="flex items-center gap-4">
                  {iconPreview ? (
                    <div className="relative">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                        <Image
                          src={iconPreview || "/placeholder.svg"}
                          alt="Facility icon"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveIcon}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-90 hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="h-16 w-16 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setIconText("") // Clear text icon when clicking upload
                        fileInputRef.current?.click()
                      }}
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleIconUpload}
                        className="hidden"
                      />
                    </div>
                  )}

                  {!iconPreview && (
                    <p className="text-xs text-muted-foreground">Click to upload an icon image (SVG, PNG, or JPG)</p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Choose either an icon name/URL or upload an image. If both are provided, the uploaded image will be used.
            </p>
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

