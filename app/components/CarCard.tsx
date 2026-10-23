"use client"

import Image from "next/image"
import Link from "next/link"
import type { Car } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Fuel, Gauge, ArrowUpRight, CalendarDays, Palette } from "lucide-react"
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
    <Card className="group h-full overflow-hidden rounded-3xl border-border bg-card py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          className="object-cover transition-all duration-700! group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <Badge className="absolute left-4 top-4 rounded-full border border-white/20 bg-blue-500 px-3 py-1 text-white dark:text-[#fff] backdrop-blur hover:bg-black/45">
          {car.bodyType}
        </Badge>
        <Badge className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[#171717] dark:bg-[#fff] hover:bg-white/95">
          {car.isAvailable ? "Available" : "Sold"}
        </Badge>
        <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white dark:text-[#fff] backdrop-blur">
          {car.fuelType}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{car.year} · {car.make}</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{car.model}</h3>
          </div>
          <p className="shrink-0 text-lg font-semibold tracking-tight text-blue-500">{formatPrice(car.price)}</p>
        </div>

        <div className="my-5 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-border py-4 text-xs text-muted-foreground">
          <div className="flex min-w-0 items-center gap-2">
            <Gauge className="h-4 w-4 shrink-0 text-foreground/70" />
            <span className="truncate">{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-foreground/70" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Fuel className="h-4 w-4 shrink-0 text-foreground/70" />
            <span className="truncate">{car.fuelType}</span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Palette className="h-4 w-4 shrink-0 text-foreground/70" />
            <span className="truncate">{car.color}</span>
          </div>
        </div>

        {car.description && <p className="mb-5 line-clamp-2 text-sm leading-6 text-muted-foreground">{car.description}</p>}

        <div className="mt-auto flex gap-2">
          <Button asChild className="h-11 flex-1 rounded-full bg-blue-500 text-background hover:bg-blue-600">
            <Link href={`/cars/${car.id}`}>View details <ArrowUpRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-4">
            <Link href={`/contact?car=${car.id}`}>Enquire</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
