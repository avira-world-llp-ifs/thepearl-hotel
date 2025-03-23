import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const imagePath = url.searchParams.get("path")

    if (!imagePath) {
      return new NextResponse("Image path is required", { status: 400 })
    }

    // Get the absolute path to the public directory
    const publicDir = path.join(process.cwd(), "public")

    // Construct the full path to the image
    const fullPath = path.join(publicDir, imagePath)

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Image not found: ${fullPath}`)
      return new NextResponse("Image not found", { status: 404 })
    }

    // Read the file
    const imageBuffer = fs.readFileSync(fullPath)

    // Determine content type based on file extension
    const ext = path.extname(imagePath).toLowerCase()
    let contentType = "application/octet-stream"

    if (ext === ".jpg" || ext === ".jpeg") {
      contentType = "image/jpeg"
    } else if (ext === ".png") {
      contentType = "image/png"
    } else if (ext === ".gif") {
      contentType = "image/gif"
    } else if (ext === ".webp") {
      contentType = "image/webp"
    }

    // Return the image
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return new NextResponse("Error serving image", { status: 500 })
  }
}

