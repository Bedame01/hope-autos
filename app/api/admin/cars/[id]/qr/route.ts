import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdminRequest } from "@/lib/admin-auth"
import { getVehicleUrl } from "@/lib/vehicle-url"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!/^[a-z0-9]{1,64}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 })
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json({ url: getVehicleUrl(car.id) })
  } catch (error) {
    console.error("Error generating vehicle URL:", error)
    return NextResponse.json({ error: "Failed to generate vehicle URL" }, { status: 500 })
  }
}
