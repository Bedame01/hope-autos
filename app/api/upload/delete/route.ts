import { type NextRequest, NextResponse } from "next/server"
import { deleteFromCloudinary, extractPublicId } from "@/lib/cloudinary"

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 })
    }

    const publicId = extractPublicId(imageUrl)
    const success = await deleteFromCloudinary(publicId)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully",
      })
    } else {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
