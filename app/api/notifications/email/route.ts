import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    })

    if (!preferences) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 })
    }

    return NextResponse.json({
      emailNotifications: preferences.emailNotifications,
      priceAlerts: preferences.priceAlerts,
      newArrivals: preferences.newArrivals,
    })
  } catch (error) {
    console.error("Error fetching email preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { emailNotifications, priceAlerts, newArrivals } = await request.json()

    const updated = await prisma.userPreferences.update({
      where: { userId: session.user.id },
      data: {
        emailNotifications,
        priceAlerts,
        newArrivals,
      },
    })

    return NextResponse.json({
      emailNotifications: updated.emailNotifications,
      priceAlerts: updated.priceAlerts,
      newArrivals: updated.newArrivals,
    })
  } catch (error) {
    console.error("Error updating email preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}