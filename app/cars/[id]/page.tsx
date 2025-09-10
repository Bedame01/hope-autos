"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
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
  Heart,
  Share2,
  Eye,
} from "lucide-react"
import { getDetailImageUrl, getThumbnailUrl, isCloudinaryUrl, getHeroImageUrl } from "@/lib/cloudinary"
import type { Car } from "@/lib/types"
import CarCard from "@/app/components/CarCard"

interface CarDetailPageProps {
  params: {
    id: string
  }
}

// Fetch car data on the client side
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

// Fetch similar cars
async function getSimilarCars(carId: string, make: string, bodyType: string, priceRange: number): Promise<Car[]> {
  try {
    const params = new URLSearchParams({
      make,
      bodyType,
      minPrice: Math.max(0, priceRange - 10000).toString(),
      maxPrice: (priceRange + 10000).toString(),
      exclude: carId,
      limit: "6",
    })

    const response = await fetch(`/api/cars/similar?${params}`)
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("Error fetching similar cars:", error)
    return []
  }
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const { data: session } = useSession()
  const [car, setCar] = useState<Car | null>(null)
  const [similarCars, setSimilarCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [similarLoading, setSimilarLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [viewCount, setViewCount] = useState(0)

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

  const handleFavoriteToggle = async () => {
    if (!session) {
      // Redirect to login
      window.location.href = "/auth/signin"
      return
    }

    setFavoriteLoading(true)
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car?.id }),
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && car) {
      try {
        await navigator.share({
          title: `${car.year} ${car.make} ${car.model}`,
          text: `Check out this ${car.year} ${car.make} ${car.model} for $${car.price.toLocaleString()}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
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

  // Check if car is favorited
  useEffect(() => {
    async function checkFavoriteStatus() {
      if (session && car) {
        try {
          const response = await fetch(`/api/user/favorites/${car.id}`)
          const data = await response.json()
          setIsFavorite(data.isFavorite)
        } catch (error) {
          console.error("Error checking favorite status:", error)
        }
      }
    }
    checkFavoriteStatus()
  }, [session, car])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const carData = await getCarById(params.id)
      setCar(carData)
      setLoading(false)

      if (carData) {
        // Track view and get view count
        try {
          await fetch(`/api/cars/${params.id}/view`, { method: "POST" })
          const viewResponse = await fetch(`/api/cars/${params.id}/view`)
          const viewData = await viewResponse.json()
          setViewCount(viewData.viewCount)
        } catch (error) {
          console.error("Error tracking view:", error)
        }

        // Fetch similar cars
        setSimilarLoading(true)
        const similar = await getSimilarCars(carData.id, carData.make, carData.bodyType, carData.price)
        setSimilarCars(similar)
        setSimilarLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading car details...</p>
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
      <div className="min-h-screen bg-background pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/cars" className="hover:text-blue-600">
                  Cars
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">
                {car.year} {car.make} {car.model}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div
                className="relative h-96 mb-4 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity group"
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
                <div className="absolute inset-0 hover:bg-background/60 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/50 text-foreground px-3 py-1 rounded text-sm">
                    Click to view full size
                  </div>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-background bg-opacity-50 text-foreground px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
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
                      className="relative h-20 rounded overflow-hidden bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={handleMainImageClick}
                    >
                      <span className="text-sm font-medium text-muted-foreground">+{images.length - 8} more</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div>
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFavoriteToggle}
                      disabled={favoriteLoading}
                      className={isFavorite ? "text-red-500 border-red-500" : ""}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary">{car.bodyType}</Badge>
                  <Badge variant="outline">{car.fuelType}</Badge>
                  {car.isAvailable ? (
                    <Badge className="bg-green-600">Available</Badge>
                  ) : (
                    <Badge className="bg-red-600">Sold</Badge>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground ml-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    {viewCount} views
                  </div>
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
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Year: {car.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mileage: {car.mileage.toLocaleString()} miles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fuel: {car.fuelType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Transmission: {car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Color: {car.color}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Body: {car.bodyType}</span>
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
                  <Link href="tel:5551234567">
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
                <p className="text-muted-foreground leading-relaxed">
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
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No features listed for this vehicle.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Similar Vehicles */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Similar Vehicles</h2>
              <Link href="/cars" className="text-blue-600 hover:text-blue-600/80 text-sm font-medium">
                View All Cars →
              </Link>
            </div>

            {similarLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-muted h-48 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : similarCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarCars.map((similarCar) => (
                  <CarCard key={similarCar.id} car={similarCar} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No similar vehicles found.</p>
                <Link href="/cars" className="text-blue-600 hover:text-blue-600/80 mt-2 inline-block">
                  Browse all vehicles
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-[var(--border-line)] mt-8 pb-5 pt-8 md:pt-10 text-center text-sm sm:text-base">
          <p className="text-[var(--text-color)] mb-1.5">
            © {new Date().getFullYear()} Hope Autos Limited. All rights reserved.
            {/* <Link href="/privacy" className="hover:text-[var(--text-color)] ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="hover:text-[var(--text-color)] ml-1">
              Terms of Service
            </Link> */}
          </p>
          <p className="text-[var(--text-color)]">No 1 Nigeria Best Vehicle Dealership</p>
        </div>
      </div>


      {/* Full Screen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-20 right-4 z-50 hover:bg-foreground/30 text-foreground p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 z-10 bg-background/80 bg-opacity-50 text-blue-600 p-2 rounded-full hover:bg-opacity-75 transition-all"
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
                className="absolute right-4 z-10 bg-background/80 bg-opacity-50 text-blue-600 p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-foreground/20 bg-opacity-50 text-foreground px-4 py-2 rounded-full">
                {currentImageIndex + 1} of {images.length}
              </div>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4 custom-scrollbar">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-12 rounded overflow-hidden flex-shrink-0 transition-all ${
                      index === currentImageIndex
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-black"
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
    </>
  )
}
