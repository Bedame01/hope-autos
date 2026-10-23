import "server-only"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: "hope-autos/cars", resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload returned no secure URL"))
          return
        }

        resolve(result.secure_url)
      },
    )

    upload.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) {
    throw new Error("A Cloudinary public ID is required")
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
  return result.result === "ok"
}
