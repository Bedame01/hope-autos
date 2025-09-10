import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const make = searchParams.get("make")
    const bodyType = searchParams.get("bodyType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const exclude = searchParams.get("exclude")
    const limit = searchParams.get("limit") || "6"

    if (!make || !bodyType) {
      return NextResponse.json({ error: "Make and bodyType are required" }, { status: 400 })
    }

    const cars = await prisma.car.findMany({
      where: {
        AND: [
          { isAvailable: true },
          { id: { not: exclude || undefined } },
          {
            OR: [{ make: { contains: make, mode: "insensitive" } }, { bodyType: bodyType.toUpperCase() }],
          },
          minPrice ? { price: { gte: Number.parseInt(minPrice) } } : {},
          maxPrice ? { price: { lte: Number.parseInt(maxPrice) } } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
      take: Number.parseInt(limit),
      orderBy: [
        { make: make ? "asc" : undefined },
        { bodyType: bodyType ? "asc" : undefined },
        { createdAt: "desc" },
      ].filter(Boolean),
    })

    // Transform the data to match the expected format
    const transformedCars = cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: (car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()) as any,
      transmission: (car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()) as any,
      bodyType: (car.bodyType.charAt(0) + car.bodyType.slice(1).toLowerCase()) as any,
      images: car.images,
      description: car.description,
      features: car.features,
      isAvailable: car.isAvailable,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }))

    return NextResponse.json(transformedCars)
  } catch (error) {
    console.error("Error fetching similar cars:", error)
    return NextResponse.json({ error: "Failed to fetch similar cars" }, { status: 500 })
  }
}
