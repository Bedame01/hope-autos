import { type NextRequest, NextResponse } from "next/server"
import { getCarById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!/^[a-z0-9]{1,64}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid car ID" }, { status: 400 })
  }

  try {
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
