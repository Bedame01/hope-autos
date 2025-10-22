import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend, FROM_EMAIL } from "@/lib/email"
import { PriceAlertEmail } from "@/app/emails/price-alert-email"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { carId, oldPrice, newPrice } = await request.json()

    if (!carId || oldPrice === undefined || newPrice === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get car details
    const car = await prisma.car.findUnique({
      where: { id: carId },
    })

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { preferences: true },
    })

    if (!user || !user.preferences?.emailNotifications || !user.preferences?.priceAlerts) {
      return NextResponse.json({ error: "User has price alerts disabled" }, { status: 400 })
    }

    // Get currency setting
    const settings = await prisma.adminSetting.findUnique({
      where: { key: "currency" },
    })

    const currency = settings?.value || "USD"
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)

    // Send email
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `Price Drop Alert! ${car.year} ${car.make} ${car.model}`,
        react: PriceAlertEmail({
          name: user.name || "User",
          carMake: car.make,
          carModel: car.model,
          year: car.year,
          oldPrice,
          newPrice,
          discount,
          carUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cars/${car.id}`,
          currency,
        }),
      })

      console.log(`Price alert email sent to ${user.email} for car ${carId}`)

      return NextResponse.json({
        success: true,
        message: "Price alert email sent",
      })
    } catch (emailError) {
      console.error("Error sending price alert email:", emailError)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Price alert error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}