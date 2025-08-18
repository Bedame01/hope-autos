"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Settings,
  CarIcon,
  Phone,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getDetailImageUrl, getThumbnailUrl, isCloudinaryUrl, getHeroImageUrl } from "@/lib/cloudinary"
import type { Car } from "@/lib/types"

interface CarDetailPageProps {
  params: {
    id: string
  }
}

// We'll need to fetch the car data on the client side now
async function getCarById(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`/api/cars/${id}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error fetching car:", error)
    return null
  }
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleMainImageClick = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return

    switch (e.key) {
      case "Escape":
        handleModalClose()
        break
      case "ArrowLeft":
        handlePrevImage()
        break
      case "ArrowRight":
        handleNextImage()
        break
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen])

  useEffect(() => {
    async function fetchCar() {
      const carData = await getCarById(params.id)
      setCar(carData)
      setLoading(false)
    }
    fetchCar()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-[var(--text-color)]">Loading car details...</p>
        </div>
      </div>
    )
  }

  if (!car) {
    notFound()
  }

  const images =
    car.images && car.images.length > 0 ? car.images : ["/placeholder.svg?height=600&width=800&text=No+Image"]

  const getCurrentImageUrl = (index: number) => {
    const image = images[index]
    return image && isCloudinaryUrl(image) ? getDetailImageUrl(image) : image
  }

  const getThumbnailImageUrl = (image: string) => {
    return isCloudinaryUrl(image) ? getThumbnailUrl(image) : image
  }

  const getModalImageUrl = (image: string) => {
    return isCloudinaryUrl(image) ? getHeroImageUrl(image) : image
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-15">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-[var(--text-color)]">
              <li>
                <Link href="/" className="hover:text-[var(--foreground)]">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/cars" className="hover:text-[var(--foreground)]">
                  Cars
                </Link>
              </li>
              <li>/</li>
              <li className="text-[var(--foreground)]">
                {car.year} {car.make} {car.model}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div
                className="relative h-96 mb-4 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                onClick={handleMainImageClick}
              >
                <Image
                  src={getCurrentImageUrl(currentImageIndex) || "/placeholder.svg"}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="carImageDisplay absolute inset-0 bg-black opacity-0 hover:opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black text-[var(--foreground)] px-3 py-1 rounded text-sm">
                    Click to view full size
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 8).map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-20 rounded overflow-hidden cursor-pointer transition-all duration-200 ${
                        index === currentImageIndex ? "ring-2 ring-blue-600 ring-offset-2" : "hover:opacity-75"
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <Image
                        src={getThumbnailImageUrl(image) || "/placeholder.svg"}
                        alt={`${car.make} ${car.model} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 200px"
                      />
                    </div>
                  ))}

                  {/* Show more indicator if there are more than 8 images */}
                  {images.length > 8 && (
                    <div
                      className="relative h-20 rounded overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                      onClick={handleMainImageClick}
                    >
                      <span className="text-sm flex items-center flex-wrap font-medium text-[var(--text-color)]">+{images.length - 8} more</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                  {car.year} {car.make} {car.model}
                </h1>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary">{car.bodyType}</Badge>
                  <Badge variant="outline">{car.fuelType}</Badge>
                  {car.isAvailable ? (
                    <Badge className="bg-green-600">Available</Badge>
                  ) : (
                    <Badge className="bg-red-600">Sold</Badge>
                  )}
                </div>
                <p className="text-4xl font-bold text-blue-600">${car.price.toLocaleString()}</p>
              </div>

              {/* Key Specs */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Key Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm flex items-center flex-wrap">Year: <span className="font-medium">{car.year}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-gray-500" />
                      <span className="text-sm flex items-center flex-wrap">Mileage:<span className="font-medium">{car.mileage.toLocaleString()}</span> miles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-gray-500" />
                      <span className="text-sm flex items-center flex-wrap">Fuel: <span className="font-medium">{car.fuelType}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span className="text-sm flex items-center flex-wrap">Transmission:<span className="font-medium">{car.transmission}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-gray-500" />
                      <span className="text-sm flex items-center flex-wrap">Color:<span className="font-medium">{car.color}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm flex items-center flex-wrap">Body:<span className="font-medium">{car.bodyType}</span></span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Actions */}
              <div className="space-y-4">
                <Button size="lg" className="w-full btn1" asChild>
                  <Link href={`/contact?car=${car.id}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Request Information
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="tel:08133531046">
                    <Phone className="h-4 w-4 mr-2" />
                    Call (234) 8133531046
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Description and Features */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-color)] leading-relaxed">
                  {car.description || "No description available for this vehicle."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                {car.features && car.features.length > 0 ? (
                  <ul className="space-y-2">
                    {car.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-[var(--text-color)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features listed for this vehicle.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-[#fff] p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <X className="h-6 w-6 fill-[var(--text-color)]" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 z-10 bg-black bg-opacity-50 text-[#fff] p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Main Image */}
            <div className="relative max-w-6xl max-h-full">
              <Image
                src={getModalImageUrl(images[currentImageIndex]) || "/placeholder.svg"}
                alt={`${car.year} ${car.make} ${car.model} - Image ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-w-full max-h-full"
                priority
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 z-10 bg-black bg-opacity-50 text-[#fff] p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-20 text-[#fff] px-4 py-2 rounded-full">
                {currentImageIndex + 1} of {images.length}
              </div>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-12 rounded overflow-hidden flex-shrink-0 transition-all ${
                      index === currentImageIndex
                        ? "ring-2 ring-[#fff] ring-offset-2 ring-offset-black"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={getThumbnailImageUrl(image) || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      <div className="border-t border-[var(--border-line)] mt-5 mb-8 pt-8 md:pt-10 text-center px-3">
        <p className="text-[var(--text-color)] text-sm">
          © {new Date().getFullYear()} Hope Autos. All rights reserved. |
          <Link href="/privacy" className="hover:text-gray-500 ml-1">
            Privacy Policy
          </Link>{" "}
          |
          <Link href="/terms" className="hover:text-gray-500 ml-1">
            Terms of Service
          </Link>
        </p>
      </div>
    </>
  )
}
