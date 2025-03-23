import { type NextRequest, NextResponse } from "next/server"
import { categoryService } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const categories = await categoryService.getAll()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    // Handle multipart form data
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const basePrice = Number.parseFloat(formData.get("basePrice") as string)
    const imageFile = formData.get("image") as File | null

    // Validate required fields
    if (!name || !description || isNaN(basePrice)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let imagePath = null

    // Handle image upload if provided
    if (imageFile) {
      try {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const filename = `${uuidv4()}-${imageFile.name.replace(/\s/g, "_")}`

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads/categories")

        // Save file
        const filePath = path.join(uploadDir, filename)
        await writeFile(filePath, buffer)

        // Store relative path for database
        imagePath = `/uploads/categories/${filename}`
      } catch (error) {
        console.error("Error saving image:", error)
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
      }
    }

    const category = await categoryService.create({
      name,
      description,
      basePrice,
      ...(imagePath && { image: imagePath }),
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

