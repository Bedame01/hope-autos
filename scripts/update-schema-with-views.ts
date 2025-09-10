import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🔄 Updating database schema...")

  try {
    // Add viewCount field to existing cars (if not already present)
    const carsWithoutViewCount = await prisma.car.findMany({
      where: {
        viewCount: undefined,
      },
    })

    if (carsWithoutViewCount.length > 0) {
      console.log(`📊 Adding viewCount to ${carsWithoutViewCount.length} cars...`)

      await prisma.car.updateMany({
        where: {
          viewCount: undefined,
        },
        data: {
          viewCount: 0,
        },
      })
    }

    // Update user preferences with new fields
    const usersWithoutExtendedPrefs = await prisma.userPreferences.findMany({
      where: {
        OR: [{ theme: null }, { language: null }, { timezone: null }, { currency: null }],
      },
    })

    if (usersWithoutExtendedPrefs.length > 0) {
      console.log(`👤 Updating preferences for ${usersWithoutExtendedPrefs.length} users...`)

      for (const pref of usersWithoutExtendedPrefs) {
        await prisma.userPreferences.update({
          where: { id: pref.id },
          data: {
            theme: pref.theme || "light",
            language: pref.language || "en",
            timezone: pref.timezone || "UTC",
            currency: pref.currency || "USD",
            profileVisibility: pref.profileVisibility || "private",
            showEmail: pref.showEmail ?? false,
            showPhone: pref.showPhone ?? false,
          },
        })
      }
    }

    console.log("✅ Database schema updated successfully!")

    // Display some stats
    const totalCars = await prisma.car.count()
    const totalUsers = await prisma.user.count()
    const totalFavorites = await prisma.favoriteCar.count()
    const totalInquiries = await prisma.inquiry.count()

    console.log("\n📈 Current Database Stats:")
    console.log(`   Cars: ${totalCars}`)
    console.log(`   Users: ${totalUsers}`)
    console.log(`   Favorites: ${totalFavorites}`)
    console.log(`   Inquiries: ${totalInquiries}`)
  } catch (error) {
    console.error("❌ Error updating schema:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
