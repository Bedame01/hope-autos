import { type NextRequest, NextResponse } from "next/server"
import { getCars, addCar } from "@/lib/db"

export async function GET() {
  try {
    const cars = await getCars()
    return NextResponse.json(cars)
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const carData = await request.json()

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

    const newCar = await addCar(carData)
    return NextResponse.json(newCar, { status: 201 })
  } catch (error) {
    console.error("Error adding car:", error)
    return NextResponse.json({ error: "Failed to add car" }, { status: 500 })
  }
}
