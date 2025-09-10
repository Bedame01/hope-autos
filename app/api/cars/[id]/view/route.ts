import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const carId = params.id

    // Increment view count
    await prisma.car.update({
      where: { id: carId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const carId = params.id

    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { viewCount: true },
    })

    return NextResponse.json({ viewCount: car?.viewCount || 0 })
  } catch (error) {
    console.error("Error fetching view count:", error)
    return NextResponse.json({ viewCount: 0 })
  }
}
