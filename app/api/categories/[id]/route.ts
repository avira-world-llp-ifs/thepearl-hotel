import { type NextRequest, NextResponse } from "next/server"
import { categoryService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await categoryService.getById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const basePrice = Number.parseFloat(formData.get("basePrice") as string)
    const imageFile = formData.get("image") as File | null
    const currentImage = formData.get("currentImage") as string | null
    const removeImage = formData.get("removeImage") === "true"

    // Validate required fields
    if (!name || !description || isNaN(basePrice)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let imagePath = removeImage ? null : currentImage

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads/categories")
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        // Save file
        const filePath = path.join(uploadDir, filename)
        fs.writeFileSync(filePath, buffer)

        // Store relative path for database
        imagePath = `/uploads/categories/${filename}`

        // Remove old image if exists and different from current
        if (currentImage && currentImage !== imagePath) {
          const oldFilePath = path.join(process.cwd(), "public", currentImage)
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath)
          }
        }
      } catch (error) {
        console.error("Error saving image:", error)
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
      }
    }

    const updatedCategory = await categoryService.update(params.id, {
      name,
      description,
      basePrice,
      ...(imagePath !== undefined && { image: imagePath }),
    })

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    // Get the category to check if it has an image
    const category = await categoryService.getById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Delete the image file if it exists
    if (category.image) {
      try {
        const imagePath = path.join(process.cwd(), "public", category.image)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      } catch (error) {
        console.error("Error deleting image file:", error)
        // Continue with category deletion even if image deletion fails
      }
    }

    const deletedCategory = await categoryService.delete(params.id)

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

