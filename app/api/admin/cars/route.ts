import { type NextRequest, NextResponse } from "next/server"
import { getCars, addCar } from "@/lib/db"
import { isAdminRequest } from "@/lib/admin-auth"
import { normalizeVehicleImages } from "@/lib/car-images"

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cars = await getCars(undefined, true)
    return NextResponse.json(cars)
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const carData = await request.json()
    const idempotencyKey = request.headers.get("Idempotency-Key")

    if (carData.images !== undefined) {
      const images = normalizeVehicleImages(carData.images)
      if (!images) {
        return NextResponse.json(
          { error: "Images must be an array of strings with no more than 15 unique photos." },
          { status: 400 },
        )
      }
      carData.images = images
    }

    if (!idempotencyKey || !/^[a-z0-9-]{16,64}$/i.test(idempotencyKey)) {
      return NextResponse.json({ error: "A valid Idempotency-Key header is required" }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = [
      "make",
      "model",
      "year",
      "price",
      "mileage",
      "color",
      "fuelType",
      "transmission",
      "bodyType",
    ]
    for (const field of requiredFields) {
      if (!carData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const newCar = await addCar(carData, idempotencyKey)
    return NextResponse.json(newCar, { status: 201 })
  } catch (error) {
    console.error("Error adding car:", error)
    return NextResponse.json({ error: "Failed to add car" }, { status: 500 })
  }
}
