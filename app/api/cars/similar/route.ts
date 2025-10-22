import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const carId = searchParams.get("carId")
    const limit = Number.parseInt(searchParams.get("limit") || "6")

    if (!carId) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 })
    }

    // Get the reference car
    const referenceCar = await prisma.car.findUnique({
      where: { id: carId },
    })

    if (!referenceCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    // Find similar cars based on key specifications
    const similarCars = await prisma.car.findMany({
      where: {
        AND: [
          { id: { not: carId } },
          { isAvailable: true },
          {
            OR: [
              // Same make and body type
              {
                AND: [
                  { make: { equals: referenceCar.make, mode: "insensitive" } },
                  { bodyType: referenceCar.bodyType },
                ],
              },
              // Same body type and similar price range (±20%)
              {
                AND: [
                  { bodyType: referenceCar.bodyType },
                  { price: { gte: referenceCar.price * 0.8, lte: referenceCar.price * 1.2 } },
                  { year: { gte: referenceCar.year - 3 } },
                ],
              },
              // Same fuel type and similar price range
              {
                AND: [
                  { fuelType: referenceCar.fuelType },
                  { price: { gte: referenceCar.price * 0.85, lte: referenceCar.price * 1.15 } },
                  { year: { gte: referenceCar.year - 2 } },
                ],
              },
              // Similar year and transmission
              {
                AND: [
                  { year: { gte: referenceCar.year - 2, lte: referenceCar.year + 1 } },
                  { transmission: referenceCar.transmission },
                  { price: { gte: referenceCar.price * 0.9, lte: referenceCar.price * 1.1 } },
                ],
              },
            ],
          },
        ],
      },
      take: limit * 2, // Fetch more to have variety
      orderBy: [
        {
          // Prioritize exact make and body type match
          make: referenceCar.make === "Toyota" ? "asc" : "desc",
        },
        { createdAt: "desc" },
      ],
    })

    // Score cars based on similarity and randomize selection
    const scoredCars = similarCars.map((car) => {
      let score = 0

      // Same make: +40 points
      if (car.make.toLowerCase() === referenceCar.make.toLowerCase()) score += 40

      // Same body type: +30 points
      if (car.bodyType === referenceCar.bodyType) score += 30

      // Same fuel type: +20 points
      if (car.fuelType === referenceCar.fuelType) score += 20

      // Same transmission: +15 points
      if (car.transmission === referenceCar.transmission) score += 15

      // Similar year (within 1 year): +10 points
      if (Math.abs(car.year - referenceCar.year) <= 1) score += 10

      // Similar price (within 10%): +10 points
      if (Math.abs(car.price - referenceCar.price) / referenceCar.price < 0.1) score += 10

      // Similar mileage (within 20%): +5 points
      if (Math.abs(car.mileage - referenceCar.mileage) / referenceCar.mileage < 0.2) score += 5

      return { ...car, score }
    })

    // Sort by score (highest first) and add some randomization
    const rankedCars = scoredCars.sort((a, b) => {
      const scoreDiff = b.score - a.score
      // Add small randomization if scores are close
      if (Math.abs(scoreDiff) <= 10) {
        return Math.random() - 0.5
      }
      return scoreDiff
    })

    const formattedCars = rankedCars.slice(0, limit).map((car) => ({
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
      description: car.description,
      features: car.features,
      isAvailable: car.isAvailable,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedCars)
  } catch (error) {
    console.error("Error fetching similar cars:", error)
    return NextResponse.json({ error: "Failed to fetch similar cars" }, { status: 500 })
  }
}