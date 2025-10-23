import { prisma } from "@/lib/prisma"
import { resend, FROM_EMAIL, isEmailServiceConfigured } from "@/lib/email"
import { WelcomeEmail } from "@/app/emails/welcome-email"
import { ForgotPasswordEmail } from "@/app/emails/forgot-password-email"
import { PriceAlertEmail } from "@/app/emails/price-alert-email"
import { NewArrivalEmail } from "@/app/emails/new-arrival-email"

export const emailService = {
  async sendWelcomeEmail(email: string) {
    try {
      if (!isEmailServiceConfigured()) {
        console.warn("Email service not configured. Skipping welcome email.")
        return { success: false, error: "Email service not configured" }
      }

      // Fetch user info from Prisma
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
      if (!user) {
        return { success: false, error: "User not found" }
      }

      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Welcome to Hope Autos",
        react: WelcomeEmail({ name: user.name || "User", email: user.email }),
      })

      if (result.error) {
        console.error("Error sending welcome email:", result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error("Error in sendWelcomeEmail:", error)
      return { success: false, error: String(error) }
    }
  },

  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      if (!isEmailServiceConfigured()) {
        console.warn("Email service not configured. Skipping password reset email.")
        return { success: false, error: "Email service not configured" }
      }

      // Fetch user info from Prisma
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
      if (!user) {
        return { success: false, error: "User not found" }
      }

      const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`

      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Password Reset Request - Hope Autos",
        react: ForgotPasswordEmail({ name: user.name || "User", resetLink }),
      })

      if (result.error) {
        console.error("Error sending password reset email:", result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error("Error in sendPasswordResetEmail:", error)
      return { success: false, error: String(error) }
    }
  },

  async sendPriceAlertToFavorites(carId: string, oldPrice: number, newPrice: number) {
    try {
      if (!isEmailServiceConfigured()) {
        console.warn("Email service not configured. Skipping price alert emails.")
        return { success: true, sent: 0, failed: 0, skipped: true }
      }

      const car = await prisma.car.findUnique({
        where: { id: carId },
      })

      if (!car) {
        throw new Error("Car not found")
      }

      // Find users who have this car in their favorites
      const favorites = await prisma.favoriteCar.findMany({
        where: { carId },
        include: {
          user: {
            include: { preferences: true },
          },
        },
      })

      if (favorites.length === 0) {
        return { success: true, sent: 0, failed: 0 }
      }

      const settings = await prisma.adminSetting.findUnique({
        where: { key: "currency" },
      })

      const currency = settings?.value || "USD"
      const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)

      let sent = 0
      let failed = 0

      for (const fav of favorites) {
        if (!fav.user.preferences?.priceAlerts || !fav.user.preferences?.emailNotifications) {
          continue
        }

        try {
          const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: fav.user.email,
            subject: `Price Drop Alert! ${car.year} ${car.make} ${car.model}`,
            react: PriceAlertEmail({
              name: fav.user.name || "User",
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

          if (result.error) {
            console.error(`Failed to send price alert to ${fav.user.email}:`, result.error)
            failed++
          } else {
            sent++
          }
        } catch (error) {
          console.error(`Exception sending price alert to ${fav.user.email}:`, error)
          failed++
        }
      }

      return { success: true, sent, failed }
    } catch (error) {
      console.error("Error in sendPriceAlertToFavorites:", error)
      return { success: false, error: String(error), sent: 0, failed: 0 }
    }
  },

  async sendNewArrivalsNotification(carIds: string[]) {
    try {
      if (!isEmailServiceConfigured()) {
        console.warn("Email service not configured. Skipping new arrivals emails.")
        return { success: true, sent: 0, failed: 0, skipped: true }
      }

      const cars = await prisma.car.findMany({
        where: { id: { in: carIds } },
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
        return { success: true, sent: 0, failed: 0 }
      }

      const settings = await prisma.adminSetting.findUnique({
        where: { key: "currency" },
      })

      const currency = settings?.value || "USD"

      let sent = 0
      let failed = 0

      for (const user of users) {
        try {
          const result = await resend.emails.send({
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

          if (result.error) {
            console.error(`Failed to send new arrivals to ${user.email}:`, result.error)
            failed++
          } else {
            sent++
          }
        } catch (error) {
          console.error(`Exception sending new arrivals to ${user.email}:`, error)
          failed++
        }
      }

      return { success: true, sent, failed }
    } catch (error) {
      console.error("Error in sendNewArrivalsNotification:", error)
      return { success: false, error: String(error), sent: 0, failed: 0 }
    }
  },
}