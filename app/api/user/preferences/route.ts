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
      id: preferences.id,
      maxPrice: preferences.maxPrice,
      preferredMakes: preferences.preferredMakes,
      preferredFuelTypes: preferences.preferredFuelTypes,
      emailNotifications: preferences.emailNotifications,
      smsNotifications: preferences.smsNotifications,
      priceAlerts: preferences.priceAlerts,
      newArrivals: preferences.newArrivals,
      theme: preferences.theme,
      language: preferences.language,
      timezone: preferences.timezone,
      currency: preferences.currency,
    })
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const updated = await prisma.userPreferences.update({
      where: { userId: session.user.id },
      data: {
        maxPrice: body.maxPrice,
        preferredMakes: body.preferredMakes,
        preferredFuelTypes: body.preferredFuelTypes,
        emailNotifications: body.emailNotifications,
        smsNotifications: body.smsNotifications,
        priceAlerts: body.priceAlerts,
        newArrivals: body.newArrivals,
        theme: body.theme,
        language: body.language,
        timezone: body.timezone,
        currency: body.currency,
      },
    })

    return NextResponse.json({
      id: updated.id,
      maxPrice: updated.maxPrice,
      preferredMakes: updated.preferredMakes,
      preferredFuelTypes: updated.preferredFuelTypes,
      emailNotifications: updated.emailNotifications,
      smsNotifications: updated.smsNotifications,
      priceAlerts: updated.priceAlerts,
      newArrivals: updated.newArrivals,
      theme: updated.theme,
      language: updated.language,
      timezone: updated.timezone,
      currency: updated.currency,
    })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
