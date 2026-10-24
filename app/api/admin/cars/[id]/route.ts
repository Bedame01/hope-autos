import { type NextRequest, NextResponse } from "next/server"
import { getCarById, updateCar, deleteCar } from "@/lib/db"
import { isAdminRequest } from "@/lib/admin-auth"
import { normalizeVehicleImages } from "@/lib/car-images"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const car = await getCarById(id)

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error("Error fetching car:", error)
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const carData = await request.json()

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

    const updatedCar = await updateCar(id, carData)

    if (!updatedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCar)
  } catch (error) {
    console.error("Error updating car:", error)
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const success = await deleteCar(id)

    if (!success) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting car:", error)
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 })
  }
}
