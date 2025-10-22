import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend, FROM_EMAIL } from "@/lib/email"
import { NewArrivalEmail } from "@/app/emails/new-arrival-email"

export async function POST(request: NextRequest) {
  try {
    const { carIds } = await request.json()

    if (!carIds || !Array.isArray(carIds) || carIds.length === 0) {
      return NextResponse.json({ error: "Invalid carIds" }, { status: 400 })
    }

    // Get cars
    const cars = await prisma.car.findMany({
      where: {
        id: { in: carIds },
      },
    })

    if (cars.length === 0) {
      return NextResponse.json({ error: "No cars found" }, { status: 404 })
    }

    // Get all users with new arrivals enabled
    const users = await prisma.user.findMany({
      where: {
        preferences: {
          newArrivals: true,
          emailNotifications: true,
        },
      },
      include: { preferences: true },
    })

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users to notify",
        usersNotified: 0,
      })
    }

    // Get currency setting
    const settings = await prisma.adminSetting.findUnique({
      where: { key: "currency" },
    })

    const currency = settings?.value || "USD"
    let successCount = 0
    let failureCount = 0

    // Send emails to all users
    for (const user of users) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `🚗 New Vehicles Arrived at Hope Autos - ${cars.length} New Cars!`,
          react: NewArrivalEmail({
            name: user.name || "User",
            cars: cars.map((car) => ({
              id: car.id,
              make: car.make,
              model: car.model,
              year: car.year,
              price: car.price,
              mileage: car.mileage,
              fuelType: car.fuelType,
              bodyType: car.bodyType,
              transmission: car.transmission,
            })),
            currency,
          }),
        })

        successCount++
        console.log(`New arrival email sent to ${user.email}`)
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError)
        failureCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `New arrival notifications sent`,
      usersNotified: successCount,
      failures: failureCount,
    })
  } catch (error) {
    console.error("New arrivals notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}