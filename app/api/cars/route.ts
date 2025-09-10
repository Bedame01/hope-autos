import { type NextRequest, NextResponse } from "next/server"
import { getCars } from "@/lib/db"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const make = searchParams.get("make")
    const model = searchParams.get("model")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minYear = searchParams.get("minYear")
    const maxYear = searchParams.get("maxYear")
    const fuelType = searchParams.get("fuelType")
    const bodyType = searchParams.get("bodyType")
    const transmission = searchParams.get("transmission")

    // Build filters object - ignore "Any" values
    const filters: any = {}

    if (make && make !== "Any") filters.make = make
    if (model && model !== "Any") filters.model = model
    if (minPrice) filters.minPrice = Number.parseInt(minPrice)
    if (maxPrice) filters.maxPrice = Number.parseInt(maxPrice)
    if (minYear) filters.minYear = Number.parseInt(minYear)
    if (maxYear) filters.maxYear = Number.parseInt(maxYear)
    if (fuelType && fuelType !== "Any") filters.fuelType = fuelType
    if (bodyType && bodyType !== "Any") filters.bodyType = bodyType
    if (transmission && transmission !== "Any") filters.transmission = transmission

    let cars

    // If there's a search query, use Prisma directly for more complex search
    if (search) {
      const searchTerms = search
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 0)

      cars = await prisma.car.findMany({
        where: {
          AND: [
            { isAvailable: true },
            {
              OR: searchTerms
                .flatMap((term) => [
                  { make: { contains: term, mode: "insensitive" } },
                  { model: { contains: term, mode: "insensitive" } },
                  { color: { contains: term, mode: "insensitive" } },
                  { description: { contains: term, mode: "insensitive" } },
                  { features: { hasSome: [term] } },
                  { year: isNaN(Number.parseInt(term)) ? undefined : Number.parseInt(term) },
                ])
                .filter(Boolean),
            },
            // Apply other filters
            make && make !== "Any" ? { make: { contains: make, mode: "insensitive" } } : {},
            model && model !== "Any" ? { model: { contains: model, mode: "insensitive" } } : {},
            minPrice ? { price: { gte: Number.parseInt(minPrice) } } : {},
            maxPrice ? { price: { lte: Number.parseInt(maxPrice) } } : {},
            minYear ? { year: { gte: Number.parseInt(minYear) } } : {},
            maxYear ? { year: { lte: Number.parseInt(maxYear) } } : {},
            fuelType && fuelType !== "Any" ? { fuelType: fuelType.toUpperCase() } : {},
            bodyType && bodyType !== "Any" ? { bodyType: bodyType.toUpperCase() } : {},
            transmission && transmission !== "Any" ? { transmission: transmission.toUpperCase() } : {},
          ].filter((condition) => Object.keys(condition).length > 0),
        },
        orderBy: { createdAt: "desc" },
      })

      // Transform the data to match the expected format
      cars = cars.map((car) => ({
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
    } else {
      // Use the existing getCars function for simple filtering
      cars = await getCars(filters)
    }

    return NextResponse.json(cars)
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}
