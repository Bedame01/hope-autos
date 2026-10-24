"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
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
  Download,
  Loader2,
} from "lucide-react"
import { getDetailImageUrl, getThumbnailUrl, isCloudinaryUrl, getHeroImageUrl } from "@/lib/cloudinary"
import { MAX_VEHICLE_IMAGES } from "@/lib/car-images"
import type { Car } from "@/lib/types"
import CarCard from "@/app/components/CarCard"
import { useCurrency } from "@/app/contexts/CurrencyContext"

async function getCarById(id: string): Promise<{ car: Car | null; error: string | null }> {
  try {
    const response = await fetch(`/api/cars/${id}`)
    if (response.status === 400 || response.status === 404) {
      return { car: null, error: null }
    }
    if (!response.ok) {
      return { car: null, error: "Unable to load this vehicle. Please try again." }
    }
    return { car: await response.json(), error: null }
  } catch (error) {
    console.error("Error fetching car:", error)
    return { car: null, error: "Unable to load this vehicle. Check your connection and try again." }
  }
}

async function getSimilarCars(carId: string): Promise<Car[]> {
  try {
    const params = new URLSearchParams({
      carId,
      limit: "6",
    })

    const response = await fetch(`/api/cars/similar?${params}`)
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Unable to load similar vehicles")
    }
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error("Similar vehicle response was invalid")
    return data
  } catch (error) {
    console.error("Error fetching similar cars:", error)
    return []
  }
}

export default function CarDetailPage() {
  const params = useParams<{ id: string }>()
  const { data: session } = useSession()
  const { formatPrice } = useCurrency()
  const [car, setCar] = useState<Car | null>(null)
  const [loadError, setLoadError] = useState("")
  const [similarCars, setSimilarCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [similarLoading, setSimilarLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [preparingPhotos, setPreparingPhotos] = useState(false)
  const [sharingPhotos, setSharingPhotos] = useState(false)
  const [selectedPhotoFiles, setSelectedPhotoFiles] = useState<File[]>([])
  const [photoDownloadError, setPhotoDownloadError] = useState("")
  const [photoDownloadNotice, setPhotoDownloadNotice] = useState("")

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

      const result: { error?: string } = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to update favorites.")
      setIsFavorite(!isFavorite)
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
          text: `Check out this ${car.year} ${car.make} ${car.model} for ${formatPrice(car.price)}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleSelectAllPhotos = async () => {
    if (!car || preparingPhotos || selectedPhotoFiles.length > 0) return

    setPreparingPhotos(true)
    setPhotoDownloadError("")
    setPhotoDownloadNotice("")

    try {
      const files: File[] = []
      let totalSize = 0
      let unavailableCount = 0

      for (const index of downloadableImageIndexes) {
        let response: Response
        try {
          response = await fetch(`/api/cars/${encodeURIComponent(car.id)}/photos?index=${index}`, {
            cache: "no-store",
          })
        } catch {
          unavailableCount += 1
          continue
        }

        if (!response.ok) {
          unavailableCount += 1
          continue
        }

        let image: Blob
        try {
          image = await response.blob()
        } catch {
          unavailableCount += 1
          continue
        }

        totalSize += image.size
        if (totalSize > 75 * 1024 * 1024) {
          throw new Error("These photos are too large to prepare together on this device.")
        }

        const fallbackName = `${String(index + 1).padStart(2, "0")}-vehicle-photo`
        const filename =
          response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/i)?.[1] ||
          `${fallbackName}.${image.type.split("/")[1] || "jpg"}`
        files.push(new File([image], filename, { type: image.type }))
      }

      if (files.length === 0) {
        throw new Error("No photos could be prepared. Please try again later.")
      }

      setSelectedPhotoFiles(files)
      setPhotoDownloadNotice(
        unavailableCount === 0
          ? `${files.length} photos selected. Tap Save to Photos/Gallery to choose where to save them.`
          : `${files.length} photos selected. ${unavailableCount} unavailable ${unavailableCount === 1 ? "photo was" : "photos were"} skipped.`,
      )
    } catch (error) {
      setPhotoDownloadError(
        error instanceof Error ? error.message : "Unable to prepare these photos. Please try again.",
      )
    } finally {
      setPreparingPhotos(false)
    }
  }

  const handleSavePhotosToDevice = async () => {
    if (selectedPhotoFiles.length === 0 || sharingPhotos) return

    if (typeof navigator.share !== "function" || typeof navigator.canShare !== "function") {
      setPhotoDownloadError(
        "This browser cannot send multiple photos to your device gallery. Try opening this page in Safari on iPhone or Chrome on Android.",
      )
      return
    }

    const shareData: ShareData = {
      files: selectedPhotoFiles,
      title: `${car?.year} ${car?.make} ${car?.model} photos`,
    }
    if (!navigator.canShare(shareData)) {
      setPhotoDownloadError(
        "This browser cannot send multiple photos to your device gallery. Try opening this page in Safari on iPhone or Chrome on Android.",
      )
      return
    }

    setSharingPhotos(true)
    setPhotoDownloadError("")
    try {
      await navigator.share(shareData)
      setPhotoDownloadNotice("The photos were shared. Choose Photos or Gallery in your device's share sheet to save them.")
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setPhotoDownloadNotice("Sharing was cancelled. Your selected photos are ready to share again.")
      } else {
        setPhotoDownloadError("Unable to open the device share sheet. Please try again.")
      }
    } finally {
      setSharingPhotos(false)
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
    async function checkFavoriteStatus() {
      if (session && car) {
        try {
          const response = await fetch(`/api/user/favorites/${car.id}`)
          const data: { isFavorite?: boolean; error?: string } = await response.json()
          if (!response.ok) throw new Error(data.error || "Unable to check favorite status.")
          setIsFavorite(Boolean(data.isFavorite))
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
      const result = await getCarById(params.id)
      setCar(result.car)
      setLoadError(result.error || "")
      setLoading(false)

      if (result.car) {
        try {
          await fetch(`/api/cars/${params.id}/view`, { method: "POST" })
          const viewResponse = await fetch(`/api/cars/${params.id}/view`)
          const viewData = await viewResponse.json()
          setViewCount(viewData.viewCount)
        } catch (error) {
          console.error("Error tracking view:", error)
        }

        setSimilarLoading(true)
        const similar = await getSimilarCars(result.car.id)
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading car details...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center" role="alert">
          <p className="text-lg text-muted-foreground">{loadError}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (!car) {
    notFound()
  }

  const images =
    car.images && car.images.length > 0 ? car.images : ["/placeholder.svg?height=600&width=800&text=No+Image"]
  const configuredCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const downloadableImageIndexes: number[] = []
  if (car.isAvailable && configuredCloudName) {
    const seenImageUrls = new Set<string>()
    car.images.slice(0, MAX_VEHICLE_IMAGES).forEach((image, index) => {
      try {
        const url = new URL(image)
        const path = url.pathname.split("/")
        const isDownloadable =
          url.protocol === "https:" &&
          url.hostname === "res.cloudinary.com" &&
          path[1]?.toLowerCase() === configuredCloudName.toLowerCase() &&
          path[2] === "image" &&
          path[3] === "upload" &&
          path.length >= 5
        if (isDownloadable && !seenImageUrls.has(image)) {
          seenImageUrls.add(image)
          downloadableImageIndexes.push(index)
        }
      } catch {
        return
      }
    })
  }

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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div>
              <button
                type="button"
                aria-label={`View larger image of ${car.year} ${car.make} ${car.model}`}
                className="group relative mb-4 block h-72 w-full overflow-hidden rounded-3xl bg-muted text-left transition-opacity hover:opacity-95 sm:h-96"
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
                <div className="absolute inset-0 bg-background/0 hover:bg-background/50 transition-all duration-200 flex items-center justify-center">
                  <div className="rounded-full bg-background/75 px-4 py-2 text-sm text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                    Click to view full size
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-background/50 text-foreground px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </button>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 8).map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      aria-label={`Show image ${index + 1} of ${car.make} ${car.model}`}
                      className={`relative h-16 overflow-hidden rounded-xl transition-all duration-200 sm:h-20 ${
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
                    </button>
                  ))}

                  {images.length > 8 && (
                    <button
                      type="button"
                      aria-label={`View ${images.length - 8} more vehicle images`}
                      className="relative h-20 rounded overflow-hidden bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={handleMainImageClick}
                    >
                      <span className="text-sm font-medium text-muted-foreground">+{images.length - 8} more</span>
                    </button>
                  )}
                </div>
              )}

              {car.isAvailable && (
                <div className="mt-4 space-y-2">
                  {downloadableImageIndexes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                        onClick={handleSelectAllPhotos}
                        disabled={preparingPhotos || selectedPhotoFiles.length > 0}
                      >
                        {preparingPhotos ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Preparing photos...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Select all photos
                          </>
                        )}
                      </Button>
                      {selectedPhotoFiles.length > 0 && (
                        <>
                          <Button
                            type="button"
                            className="rounded-xl"
                            onClick={handleSavePhotosToDevice}
                            disabled={sharingPhotos}
                          >
                            {sharingPhotos ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Opening share sheet...
                              </>
                            ) : (
                              "Save to Photos/Gallery"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-xl"
                            onClick={() => {
                              setSelectedPhotoFiles([])
                              setPhotoDownloadError("")
                              setPhotoDownloadNotice("")
                            }}
                            disabled={sharingPhotos}
                          >
                            Clear selection
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Photos are unavailable for download.</p>
                  )}
                  {downloadableImageIndexes.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Select all photos, then choose Photos or Gallery from your device’s share sheet.
                    </p>
                  )}
                  {photoDownloadError && (
                    <p className="text-sm text-destructive" role="alert">
                      {photoDownloadError}
                    </p>
                  )}
                  {photoDownloadNotice && (
                    <p className="text-sm text-muted-foreground" role="status">
                      {photoDownloadNotice}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="mb-6">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      onClick={handleFavoriteToggle}
                      disabled={favoriteLoading}
                      className={`rounded-full ${isFavorite ? "border-rose-500 text-rose-500" : ""}`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Share vehicle" className="rounded-full" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">{car.bodyType}</Badge>
                  <Badge variant="outline" className="rounded-full">{car.fuelType}</Badge>
                  {car.isAvailable ? (
                    <Badge className="rounded-full bg-green-600">Available</Badge>
                  ) : (
                    <Badge className="rounded-full bg-red-600">Sold</Badge>
                  )}
                  <div className="ml-auto flex items-center text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    {viewCount} views
                  </div>
                </div>
                <p className="text-3xl font-semibold tracking-tight text-blue-600 sm:text-4xl">{formatPrice(car.price)}</p>
              </div>

              <Card className="mb-6 rounded-3xl border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Year: <span className="font-medium">{car.year}</span></span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mileage: <span className="font-medium">{car.mileage.toLocaleString()} miles</span></span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fuel: <span className="font-medium">{car.fuelType}</span></span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Transmission: <span className="font-medium">{car.transmission}</span></span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Color: <span className="font-medium">{car.color}</span></span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                      <CarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Body: <span className="font-medium">{car.bodyType}</span></span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Listed: <span className="font-medium">{new Date(car.createdAt).toLocaleDateString()}</span></span>
                    </div>
                    {car.vin && (
                      <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-muted/40 p-3 sm:col-span-2">
                        <CarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 break-all text-sm">VIN: <span className="font-medium">{car.vin}</span></span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button size="lg" className="h-12 w-full rounded-full bg-blue-600 hover:bg-blue-500" asChild>
                  <Link href={`/contact?car=${car.id}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Request Information
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 w-full rounded-full bg-transparent" asChild>
                  <Link href="https://wa.me/2348133531046" target="_blank" rel="noopener noreferrer">
                    {/* <Phone className="h-4 w-4 mr-2" /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 96 96" id="Whatsapp-Icon--Streamline-Svg-Logos" height="24" width="24" className="mr-2 h-6! w-6!">
                      <path fill="url(#a)" d="M3.20676 47.591c-.00237 7.924 2.06817 15.6613 6.00506 22.4808l-6.38174 23.301 23.84542-6.2524c6.5694 3.5806 13.9665 5.4706 21.4944 5.4725h.0199c24.7897 0 44.9692-20.1724 44.9796-44.9664.0048-12.0148-4.6698-23.3123-13.1629-31.812C71.5149 7.3153 60.2212 2.63217 48.1879 2.62695 23.3953 2.62695 3.21718 22.798 3.20676 47.591Z"></path>
                      <path fill="url(#b)" d="M1.60084 47.5769C1.598 55.7861 3.74293 63.8001 7.82006 70.8637L1.20947 95l24.70063-6.4765c6.8058 3.7109 14.4683 5.6672 22.2657 5.6701h.0199c25.6791 0 46.5836-20.8979 46.5945-46.5793.0042-12.4465-4.8386-24.15-13.6349-32.9544C72.3577 5.85655 60.6598 1.00521 48.1957 1 22.5119 1 1.61126 21.8945 1.60084 47.5769ZM16.3103 69.6474l-.9221-1.4641c-3.8772-6.1647-5.92355-13.2884-5.92071-20.6036C9.47603 26.2337 26.8483 8.86713 48.2104 8.86713 58.5551 8.8714 68.2777 12.904 75.59 20.221c7.3123 7.3175 11.3359 17.0448 11.333 27.3905-.0095 21.3465-17.3822 38.7154-38.7273 38.7154h-.0151c-6.9503-.0038-13.7666-1.8701-19.7114-5.3971l-1.4148-.8392-14.6578 3.8431 3.9137-14.2863Z"></path>
                      <path fill="#ffffff" d="M36.55 28.1053c-.8723-1.9389-1.79-1.9777-2.6197-2.0118-.6789-.0289-1.4555-.0271-2.2311-.0271-.7766 0-2.0379.2919-3.1044 1.4565-1.0675 1.1651-4.0753 3.9815-4.0753 9.7093 0 5.7284 4.1724 11.2634 4.7538 12.041.5823.7761 8.0542 12.9065 19.8876 17.5731 9.8349 3.8781 11.8363 3.1068 13.9708 2.9125 2.1345-.1938 6.8882-2.8154 7.8581-5.5341.9704-2.7182.9704-5.0484.6795-5.535-.291-.4852-1.0675-.7766-2.2317-1.3585-1.1646-.5823-6.8882-3.3991-7.9552-3.7876-1.0675-.388-1.8436-.5818-2.6202.5837-.7761 1.1642-3.0059 3.7858-3.6853 4.5624-.679.778-1.3584.8751-2.5226.2928-1.1646-.5842-4.9143-1.8123-9.3624-5.7781-3.4612-3.086-5.7976-6.8968-6.477-8.0624-.679-1.1641-.0725-1.7948.5112-2.3752.5231-.5216 1.1647-1.3593 1.747-2.0388.5809-.6799.7746-1.1651 1.1627-1.9417.3885-.777.1943-1.4569-.0967-2.0392-.2914-.5823-2.5538-6.3396-3.5891-8.6418Z"></path>
                      <defs>
                        <linearGradient id="a" x1="4519.8" x2="4519.8" y1="9077.23" y2="2.631" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#1faf38"></stop>
                          <stop offset="1" stop-color="#60d669"></stop>
                        </linearGradient>
                        <linearGradient id="b" x1="4680.25" x2="4680.25" y1="9401.01" y2=".988" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#f9f9f9"></stop>
                          <stop offset="1" stop-color="#ffffff"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    Whatsapp Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-3xl border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {car.description || "No description available for this vehicle."}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                {car.features && car.features.length > 0 ? (
                  <ul className="space-y-2">
                    {car.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 text-blue-600 rounded-full"></div>
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={handleModalClose}
              className="absolute top-8 right-4 z-10 bg-background/50 text-foreground p-2 rounded-full hover:bg-background/75 transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 z-10 bg-background/50 text-foreground p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

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

            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 z-10 bg-background/50 text-foreground p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/50 text-foreground px-4 py-2 rounded-full">
                {currentImageIndex + 1} of {images.length}
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-12 rounded overflow-hidden flex-shrink-0 transition-all ${
                      index === currentImageIndex
                        ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-black"
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
