"use client"

import Image from "next/image"
import Link from "next/link"
import type { Car } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Fuel, Gauge, Calendar, Palette } from "lucide-react"
import { getCardImageUrl, isCloudinaryUrl } from "@/lib/cloudinary"
import { useCurrency } from "@/app/contexts/CurrencyContext"

interface CarCardProps {
  car: Car
}

export default function CarCard({ car }: CarCardProps) {
  const { formatPrice } = useCurrency()

  // Get the main image (first image in array)
  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null

  // Generate optimized image URL
  const imageUrl = mainImage
    ? isCloudinaryUrl(mainImage)
      ? getCardImageUrl(mainImage)
      : mainImage
    : "/placeholder.svg?height=300&width=400&text=No+Image"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow pt-4">
      <div className="relative h-48 w-[95%] mx-auto rounded-2xl overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <Badge className="absolute top-2 right-2 bg-blue-600">{car.fuelType}</Badge>
        {!car.isAvailable && <Badge className="absolute top-2 left-2 bg-red-600">Sold</Badge>}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(car.price)}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Gauge className="h-4 w-4" />
            <span>{car.mileage.toLocaleString()} miles</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Palette className="h-4 w-4" />
            <span>{car.color}</span>
          </div>
        </div>

        {car.description && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{car.description}</p>}

        <div className="flex space-x-2">
          <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-500">
            <Link href={`/cars/${car.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/contact?car=${car.id}`}>Contact</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
