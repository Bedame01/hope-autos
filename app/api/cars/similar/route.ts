import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const carId = searchParams.get("carId")
  const requestedLimit = Number(searchParams.get("limit") || "6")

  if (!carId) {
    return NextResponse.json({ error: "Car ID is required" }, { status: 400 })
  }
  if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
    return NextResponse.json({ error: "Limit must be a positive integer" }, { status: 400 })
  }

  try {
    const referenceCar = await prisma.car.findUnique({ where: { id: carId } })
    if (!referenceCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const candidates = await prisma.car.findMany({
      where: { id: { not: referenceCar.id }, isAvailable: true },
      orderBy: { createdAt: "desc" },
    })

    const rankedCars = candidates
      .map((car) => {
        const priceDifference =
          Math.abs(car.price - referenceCar.price) / Math.max(car.price, referenceCar.price, 1)
        const mileageDifference =
          Math.abs(car.mileage - referenceCar.mileage) / Math.max(car.mileage, referenceCar.mileage, 1)
        const yearDifference = Math.abs(car.year - referenceCar.year)
        let score = 0

        if (car.make.toLowerCase() === referenceCar.make.toLowerCase()) score += 40
        if (car.bodyType === referenceCar.bodyType) score += 25
        if (car.fuelType === referenceCar.fuelType) score += 15
        if (car.transmission === referenceCar.transmission) score += 10
        if (yearDifference <= 2) score += 10
        if (priceDifference <= 0.2) score += 10
        if (mileageDifference <= 0.2) score += 5

        return { car, score }
      })
      .sort((left, right) => right.score - left.score || right.car.createdAt.getTime() - left.car.createdAt.getTime())
      .slice(0, Math.min(requestedLimit, 12))
      .map(({ car }) => ({
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        color: car.color,
        fuelType: car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase(),
        transmission: car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase(),
        bodyType: car.bodyType.charAt(0) + car.bodyType.slice(1).toLowerCase(),
        images: car.images,
        description: car.description || "",
        features: car.features,
        isAvailable: car.isAvailable,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString(),
      }))

    return NextResponse.json(rankedCars)
  } catch (error) {
    console.error("Error fetching similar cars:", error)
    return NextResponse.json({ error: "Failed to fetch similar cars" }, { status: 500 })
  }
}
