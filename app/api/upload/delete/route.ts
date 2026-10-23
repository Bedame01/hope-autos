import { type NextRequest, NextResponse } from "next/server"
import { deleteFromCloudinary } from "@/lib/cloudinary-server"
import { extractPublicId } from "@/lib/cloudinary"
import { isAdminRequest } from "@/lib/admin-auth"

export async function DELETE(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 })
    }

    const publicId = extractPublicId(imageUrl)
    if (!publicId) {
      return NextResponse.json({ error: "Invalid Cloudinary image URL" }, { status: 400 })
    }

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
