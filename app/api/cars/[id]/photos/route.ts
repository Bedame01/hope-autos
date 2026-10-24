import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { MAX_VEHICLE_IMAGES } from "@/lib/car-images"

export const runtime = "nodejs"
export const maxDuration = 30

const MAX_IMAGE_SIZE = 10_000_000
const IMAGE_FETCH_TIMEOUT_MS = 15_000

function isAllowedCloudinaryUrl(imageUrl: string, cloudName: string): boolean {
  try {
    const url = new URL(imageUrl)
    const path = url.pathname.split("/")
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      !url.pathname.toLowerCase().includes("%2f") &&
      !url.pathname.toLowerCase().includes("%5c") &&
      path[1]?.toLowerCase() === cloudName.toLowerCase() &&
      path[2] === "image" &&
      path[3] === "upload" &&
      path.length >= 5
    )
  } catch {
    return false
  }
}

function identifyImage(data: Buffer): { extension: string; contentType: string } | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return { extension: "jpg", contentType: "image/jpeg" }
  }
  if (
    data.length >= 8 &&
    data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { extension: "png", contentType: "image/png" }
  }
  if (data.length >= 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") {
    return { extension: "webp", contentType: "image/webp" }
  }
  if (data.length >= 6 && ["GIF87a", "GIF89a"].includes(data.toString("ascii", 0, 6))) {
    return { extension: "gif", contentType: "image/gif" }
  }
  if (data.length >= 12 && data.toString("ascii", 4, 8) === "ftyp") {
    const brand = data.toString("ascii", 8, 12)
    if (brand === "avif" || brand === "avis") return { extension: "avif", contentType: "image/avif" }
  }
  return null
}

function getImageName(imageUrl: string, index: number): string {
  const lastPathPart = new URL(imageUrl).pathname.split("/").pop() || ""
  let decodedName = lastPathPart
  try {
    decodedName = decodeURIComponent(lastPathPart)
  } catch {
    // Keep the encoded path segment if it is malformed.
  }

  const baseName = decodedName.replace(/\.[^.]+$/, "")
  const slug = baseName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)

  return `${String(index + 1).padStart(2, "0")}-${slug || "vehicle-photo"}`
}

async function retrieveImage(imageUrl: string): Promise<Buffer | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: { Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif" },
      redirect: "error",
      signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
    })
    if (!response.ok || !response.body) return null

    const contentLength = Number(response.headers.get("content-length"))
    if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_SIZE) {
      await response.body.cancel()
      return null
    }

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_IMAGE_SIZE) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }

    return Buffer.concat(chunks, size)
  } catch {
    return null
  }
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[a-z0-9]{1,64}$/i.test(id)) {
    return jsonError("Invalid vehicle ID.", 400)
  }

  const imageIndexValue = request.nextUrl.searchParams.get("index")
  const imageIndex = Number(imageIndexValue)
  if (
    imageIndexValue === null ||
    !/^\d+$/.test(imageIndexValue) ||
    !Number.isInteger(imageIndex) ||
    imageIndex < 0 ||
    imageIndex >= MAX_VEHICLE_IMAGES
  ) {
    return jsonError("Invalid vehicle photo index.", 400)
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    return jsonError("Vehicle photos are temporarily unavailable.", 503)
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id },
      select: { images: true, isAvailable: true },
    })

    if (!car || !car.isAvailable) {
      return jsonError("This vehicle is not available for photo download.", 404)
    }

    const imageUrl = car.images[imageIndex]
    if (!imageUrl || !isAllowedCloudinaryUrl(imageUrl, cloudName)) {
      return jsonError("This photo is unavailable for download.", 404)
    }

    const image = await retrieveImage(imageUrl)
    if (!image) {
      return jsonError("This photo is currently unavailable. Please try again later.", 502)
    }

    const imageType = identifyImage(image)
    if (!imageType) {
      return jsonError("This photo is not in a supported image format.", 415)
    }

    const filename = `${getImageName(imageUrl, imageIndex)}.${imageType.extension}`
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": imageType.contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(image.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    console.error("Failed to download vehicle photo.")
    return jsonError("Unable to download this photo right now. Please try again.", 500)
  }
}
