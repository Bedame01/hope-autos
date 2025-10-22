import { prisma } from "@/lib/prisma"
import { resend, FROM_EMAIL } from "@/lib/email"
import { PriceAlertEmail } from "@/app/emails/price-alert-email"
import { NewArrivalEmail } from "@/app/emails/new-arrival-email"

export const emailService = {
  async sendPriceAlertToFavorites(carId: string, oldPrice: number, newPrice: number) {
    try {
      const car = await prisma.car.findUnique({
        where: { id: carId },
      })

      if (!car) {
        throw new Error("Car not found")
      }

      // Find users who have this car in their favorites
      const users = await prisma.user.findMany({
        where: {
          favoriteCarIds: {
            has: carId,
          },
          preferences: {
            priceAlerts: true,
            emailNotifications: true,
          },
        },
        include: { preferences: true },
      })

      if (users.length === 0) {
        return { success: true, sent: 0 }
      }

      const settings = await prisma.adminSetting.findUnique({
        where: { key: "currency" },
      })

      const currency = settings?.value || "USD"
      const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)

      let sent = 0
      let failed = 0

      for (const user of users) {
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
              carUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cars/${car.id}`,
              currency,
            }),
          })
          sent++
        } catch (error) {
          console.error(`Failed to send price alert to ${user.email}:`, error)
          failed++
        }
      }

      return { success: true, sent, failed }
    } catch (error) {
      console.error("Error sending price alerts:", error)
      throw error
    }
  },

  async sendNewArrivalsNotification(carIds: string[]) {
    try {
      const cars = await prisma.car.findMany({
        where: {
          id: { in: carIds },
        },
      })

      if (cars.length === 0) {
        throw new Error("No cars found")
      }

      const users = await prisma.user.findMany({
        where: {
          preferences: {
            newArrivals: true,
            emailNotifications: true,
          },
        },
      })

      if (users.length === 0) {
        return { success: true, sent: 0 }
      }

      const settings = await prisma.adminSetting.findUnique({
        where: { key: "currency" },
      })

      const currency = settings?.value || "USD"

      let sent = 0
      let failed = 0

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
          sent++
        } catch (error) {
          console.error(`Failed to send new arrivals to ${user.email}:`, error)
          failed++
        }
      }

      return { success: true, sent, failed }
    } catch (error) {
      console.error("Error sending new arrivals notifications:", error)
      throw error
    }
  },
}