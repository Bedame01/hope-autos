import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { carId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false })
    }

    const favorite = await prisma.favoriteCar.findUnique({
      where: {
        userId_carId: {
          userId: session.user.id,
          carId: params.carId,
        },
      },
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json({ isFavorite: false })
  }
}
