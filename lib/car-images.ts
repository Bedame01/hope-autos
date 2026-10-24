import { extractPublicId } from "./cloudinary"

export const MAX_VEHICLE_IMAGES = 15

export function normalizeVehicleImages(images: unknown): string[] | null {
  if (!Array.isArray(images) || !images.every((image): image is string => typeof image === "string")) {
    return null
  }

  const uniqueImages: string[] = []
  const urls = new Set<string>()
  const publicIds = new Set<string>()

  for (const image of images) {
    const url = image.trim()
    if (!url) {
      continue
    }

    const publicId = extractPublicId(url)
    if (urls.has(url) || (publicId && publicIds.has(publicId))) {
      continue
    }

    uniqueImages.push(url)
    urls.add(url)
    if (publicId) {
      publicIds.add(publicId)
    }
  }

  return uniqueImages.length <= MAX_VEHICLE_IMAGES ? uniqueImages : null
}
