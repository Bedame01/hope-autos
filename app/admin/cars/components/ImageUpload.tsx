"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Move, ImageIcon, Loader2 } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

interface CloudinaryWidget {
  open: () => void
  destroy: () => void
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (options: any, callback: (error: any, result: any) => void) => CloudinaryWidget
    }
  }
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const openCloudinaryWidget = useCallback(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget not loaded")
      return
    }

    setUploading(true)

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "hope-autos-cars",
        sources: ["local", "url", "camera"],
        multiple: true,
        maxFiles: maxImages - images.length,
        folder: "hope-autos/cars",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxImageFileSize: 10000000, // 10MB
        maxImageWidth: 2000,
        maxImageHeight: 2000,
        cropping: true,
        croppingAspectRatio: 4 / 3,
        showAdvancedOptions: true,
        showInsecurePreview: false,
        showCompletedButton: true,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#2563EB",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#2563EB",
            action: "#2563EB",
            inactiveTabIcon: "#9CA3AF",
            error: "#F56565",
            inProgress: "#2563EB",
            complete: "#059669",
            sourceBg: "#F8FAFC",
          },
        },
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Cloudinary upload error:", error)
          setUploading(false)
          return
        }

        if (result.event === "success") {
          const newImageUrl = result.info.secure_url
          onImagesChange([...images, newImageUrl])
        }

        if (result.event === "close") {
          setUploading(false)
          widget.destroy()
        }
      },
    )

    widget.open()
  }, [images, maxImages, onImagesChange])

  const removeImage = async (index: number) => {
    const imageUrl = images[index]

    // Extract public ID from Cloudinary URL for deletion
    if (imageUrl.includes("cloudinary.com")) {
      try {
        const urlParts = imageUrl.split("/")
        const uploadIndex = urlParts.findIndex((part) => part === "upload")
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
          const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/")
          const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "") // Remove file extension

          // Call delete API
          await fetch("/api/admin/images/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicId }),
          })
        }
      } catch (error) {
        console.warn("Failed to delete image from Cloudinary:", error)
      }
    }

    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== dropIndex) {
      moveImage(dragIndex, dropIndex)
    }
    setDragIndex(null)
  }

  // Load Cloudinary widget script
  if (typeof window !== "undefined" && !window.cloudinary) {
    const script = document.createElement("script")
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js"
    script.async = true
    document.head.appendChild(script)
  }

  // Helper function to get optimized image URL
  const getOptimizedImageUrl = (imageUrl: string, width?: number, height?: number): string => {
    if (!imageUrl.includes("cloudinary.com")) {
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

        pathParts.splice(uploadIndex + 1, 0, transformations)
        url.pathname = pathParts.join("/")
        return url.toString()
      }
    } catch (error) {
      console.warn("Error optimizing image URL:", error)
    }

    return imageUrl
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Car Photos</h3>
          <p className="text-sm text-gray-600">Upload up to {maxImages} photos. First image will be the main photo.</p>
        </div>
        <Badge variant="secondary">
          {images.length} / {maxImages}
        </Badge>
      </div>

      {/* Upload Button */}
      {images.length < maxImages && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <Button
              onClick={openCloudinaryWidget}
              disabled={uploading}
              className="w-full h-24 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              variant="outline"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Photos
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card
              key={`${imageUrl}-${index}`}
              className={`relative group cursor-move ${dragIndex === index ? "opacity-50" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <CardContent className="p-2">
                <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                  <Image
                    src={getOptimizedImageUrl(imageUrl, 400, 300) || "/placeholder.svg"}
                    alt={`Car image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />

                  {/* Main Image Badge */}
                  {index === 0 && <Badge className="absolute top-2 left-2 bg-blue-600">Main</Badge>}

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="destructive" onClick={() => removeImage(index)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Drag Handle */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded p-1">
                      <Move className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="mt-2 text-xs text-gray-500 text-center">Image {index + 1}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images uploaded yet</p>
            <p className="text-sm text-gray-400">Click the upload button to add car photos</p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {images.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>• Drag and drop images to reorder them</p>
          <p>• The first image will be used as the main photo</p>
          <p>• Images are automatically optimized for web</p>
        </div>
      )}
    </div>
  )
}
