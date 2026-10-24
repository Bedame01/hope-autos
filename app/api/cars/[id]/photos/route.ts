import { type NextRequest, NextResponse } from "next/server"
import { Readable } from "node:stream"
import { ZipArchive } from "archiver"
import { prisma } from "@/lib/prisma"
import { MAX_VEHICLE_IMAGES } from "@/lib/car-images"

export const runtime = "nodejs"
export const maxDuration = 180

const MAX_IMAGE_SIZE = 10_000_000
const MAX_ARCHIVE_IMAGE_SIZE = 75 * 1024 * 1024
const IMAGE_FETCH_TIMEOUT_MS = 15_000
const DOWNLOAD_CONCURRENCY = 3

interface DownloadableImage {
  url: string
  name: string
}

interface RetrievedImage extends DownloadableImage {
  data: Buffer
  extension: string
}

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

function getFileExtension(data: Buffer): string | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "jpg"
  if (
    data.length >= 8 &&
    data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "png"
  }
  if (data.length >= 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") {
    return "webp"
  }
  if (data.length >= 6 && ["GIF87a", "GIF89a"].includes(data.toString("ascii", 0, 6))) return "gif"
  if (data.length >= 12 && data.toString("ascii", 4, 8) === "ftyp") {
    const brand = data.toString("ascii", 8, 12)
    if (brand === "avif" || brand === "avis") return "avif"
  }
  return null
}

function getImageName(url: string, index: number): string {
  const lastPathPart = new URL(url).pathname.split("/").pop() || ""
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

async function retrieveImage(url: string, name: string): Promise<RetrievedImage | null> {
  try {
    const response = await fetch(url, {
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

    const data = Buffer.concat(chunks, size)
    const extension = getFileExtension(data)
    if (!extension) return null
    return { url, name, data, extension }
  } catch {
    return null
  }
}

function getArchiveFileName(year: number, make: string, model: string): string {
  const safePart = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  return `${year}-${safePart(make)}-${safePart(model)}-Photos.zip`
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[a-z0-9]{1,64}$/i.test(id)) {
    return jsonError("Invalid vehicle ID.", 400)
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    return jsonError("Vehicle photos are temporarily unavailable.", 503)
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id },
      select: { year: true, make: true, model: true, images: true, isAvailable: true },
    })

    if (!car || !car.isAvailable) {
      return jsonError("This vehicle is not available for photo download.", 404)
    }

    const seenUrls = new Set<string>()
    const imageRecords = car.images.slice(0, MAX_VEHICLE_IMAGES)
    const candidates: DownloadableImage[] = imageRecords
      .filter((url) => {
        if (!isAllowedCloudinaryUrl(url, cloudName) || seenUrls.has(url)) return false
        seenUrls.add(url)
        return true
      })
      .map((url, index) => ({ url, name: getImageName(url, index) }))

    if (candidates.length === 0) {
      return jsonError("Photos are currently unavailable for this vehicle.", 404)
    }

    const retrievedImages: RetrievedImage[] = []
    for (let offset = 0; offset < candidates.length; offset += DOWNLOAD_CONCURRENCY) {
      const batch = candidates.slice(offset, offset + DOWNLOAD_CONCURRENCY)
      const batchImages = await Promise.all(batch.map(({ url, name }) => retrieveImage(url, name)))
      retrievedImages.push(...batchImages.filter((image): image is RetrievedImage => image !== null))

      const totalSize = retrievedImages.reduce((total, image) => total + image.data.length, 0)
      if (totalSize > MAX_ARCHIVE_IMAGE_SIZE) {
        return jsonError("These photos are too large to prepare as one download. Please contact us for assistance.", 413)
      }
    }

    if (retrievedImages.length === 0) {
      return jsonError("Photos are currently unavailable. Please try again later.", 502)
    }

    const archive = new ZipArchive({ zlib: { level: 0 } })
    archive.on("warning", () => archive.destroy(new Error("Archive generation warning")))
    archive.on("error", () => archive.destroy(new Error("Archive generation failed")))
    for (const image of retrievedImages) {
      archive.append(image.data, { name: `${image.name}.${image.extension}` })
    }
    void archive.finalize().catch(() => {
      archive.destroy(new Error("Archive generation failed"))
    })

    const zipStream = Readable.toWeb(archive) as ReadableStream<Uint8Array>
    const fileName = getArchiveFileName(car.year, car.make, car.model)
    return new Response(zipStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Photos-Included": String(retrievedImages.length),
        "X-Photos-Skipped": String(imageRecords.length - retrievedImages.length),
      },
    })
  } catch {
    console.error("Failed to generate vehicle photo archive.")
    return jsonError("Unable to prepare these photos right now. Please try again.", 500)
  }
}
