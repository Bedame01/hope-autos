"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [showModal, setShowModal] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 mb-4 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Main Image */}
      <div className="relative h-96 mb-4 rounded-lg overflow-hidden cursor-pointer" onClick={() => setShowModal(true)}>
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {images.length > 1 && (
          <>
            <Button
              size="sm"
              variant="secondary"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 8).map((image, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all ${
                selectedImage === index ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-gray-300"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <CardContent className="p-1">
                <div className="relative h-20 rounded overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${alt} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {images.length > 8 && (
            <Card className="cursor-pointer hover:ring-1 hover:ring-gray-300" onClick={() => setShowModal(true)}>
              <CardContent className="p-1">
                <div className="relative h-20 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{images.length - 8} more</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 z-10 h-8 w-8 p-0"
              onClick={() => setShowModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="relative">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={alt}
                width={800}
                height={600}
                className="object-contain max-h-[80vh] w-auto"
              />

              {images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
