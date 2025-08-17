import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      preferences: user.preferences || {
        emailNotifications: true,
        smsNotifications: false,
        priceAlerts: true,
        newArrivals: true,
        marketingNotifications: false,
        maxPrice: 50000,
        preferredMakes: [],
        preferredFuelTypes: [],
        preferredBodyTypes: [],
        profileVisible: true,
        showEmail: false,
        showPhone: false,
      },
    })
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const preferences = body.preferences || body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update or create preferences
    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        emailNotifications: preferences.emailNotifications,
        smsNotifications: preferences.smsNotifications,
        priceAlerts: preferences.priceAlerts,
        newArrivals: preferences.newArrivals,
        marketingNotifications: preferences.marketingNotifications,
        maxPrice: preferences.maxPrice,
        preferredMakes: preferences.preferredMakes,
        preferredFuelTypes: preferences.preferredFuelTypes,
        preferredBodyTypes: preferences.preferredBodyTypes,
        profileVisible: preferences.profileVisible,
        showEmail: preferences.showEmail,
        showPhone: preferences.showPhone,
      },
      create: {
        userId: user.id,
        emailNotifications: preferences.emailNotifications ?? true,
        smsNotifications: preferences.smsNotifications ?? false,
        priceAlerts: preferences.priceAlerts ?? true,
        newArrivals: preferences.newArrivals ?? true,
        marketingNotifications: preferences.marketingNotifications ?? false,
        maxPrice: preferences.maxPrice ?? 50000,
        preferredMakes: preferences.preferredMakes ?? [],
        preferredFuelTypes: preferences.preferredFuelTypes ?? [],
        preferredBodyTypes: preferences.preferredBodyTypes ?? [],
        profileVisible: preferences.profileVisible ?? true,
        showEmail: preferences.showEmail ?? false,
        showPhone: preferences.showPhone ?? false,
      },
    })

    return NextResponse.json({ preferences: updatedPreferences })
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
