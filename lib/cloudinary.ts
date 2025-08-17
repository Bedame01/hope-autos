// Cloudinary configuration and utilities
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "hope-autos-cars",
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

export const generateCloudinaryUrl = (publicId: string, transformations?: string): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`
  return transformations ? `${baseUrl}/${transformations}/${publicId}` : `${baseUrl}/${publicId}`
}

export const getOptimizedImageUrl = (imageUrl: string, width?: number, height?: number): string => {
  // Return original URL if not a Cloudinary URL
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
    return imageUrl
  }

  try {
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split("/")
    const uploadIndex = pathParts.findIndex((part) => part === "upload")

    if (uploadIndex !== -1) {
      let transformations = "f_auto,q_auto"

      if (width && height) {
        transformations += `,w_${width},h_${height},c_fill`
      } else if (width) {
        transformations += `,w_${width}`
      } else if (height) {
        transformations += `,h_${height}`
      }

      // Insert transformations after "upload"
      pathParts.splice(uploadIndex + 1, 0, transformations)
      url.pathname = pathParts.join("/")
      return url.toString()
    }
  } catch (error) {
    console.warn("Error optimizing Cloudinary URL:", error)
  }

  return imageUrl
}

export const deleteCloudinaryImage = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/admin/images/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    })

    return response.ok
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

// Extract public ID from Cloudinary URL
export const extractPublicId = (cloudinaryUrl: string): string | null => {
  try {
    const url = new URL(cloudinaryUrl)
    const pathParts = url.pathname.split("/")
    const uploadIndex = pathParts.findIndex((part) => part === "upload")

    if (uploadIndex !== -1 && uploadIndex + 1 < pathParts.length) {
      // Skip transformations if they exist
      let publicIdParts = pathParts.slice(uploadIndex + 1)

      // Remove transformations (they contain commas or start with v followed by numbers)
      publicIdParts = publicIdParts.filter((part) => !part.includes(",") && !part.match(/^v\d+$/))

      const publicIdWithExtension = publicIdParts.join("/")
      // Remove file extension
      return publicIdWithExtension.replace(/\.[^/.]+$/, "")
    }
  } catch (error) {
    console.warn("Error extracting public ID from URL:", error)
  }

  return null
}

// Check if URL is a Cloudinary URL
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes("cloudinary.com")
}

// Get thumbnail URL for admin previews
export const getThumbnailUrl = (imageUrl: string): string => {
  return getOptimizedImageUrl(imageUrl, 200, 150)
}

// Get card image URL for car listings
export const getCardImageUrl = (imageUrl: string): string => {
  return getOptimizedImageUrl(imageUrl, 400, 300)
}

// Get detail page image URL
export const getDetailImageUrl = (imageUrl: string): string => {
  return getOptimizedImageUrl(imageUrl, 800, 600)
}

// Get hero image URL
export const getHeroImageUrl = (imageUrl: string): string => {
  return getOptimizedImageUrl(imageUrl, 1200, 800)
}
