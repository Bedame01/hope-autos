import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function updatePreferencesSchema() {
  try {
    console.log("🔄 Updating UserPreferences schema...")

    // Note: This script documents the changes needed
    // Run `npx prisma db push` or create a migration after updating the schema

    console.log("📋 Schema changes needed:")
    console.log("✅ Added bio field to User model")
    console.log("✅ Added preferredBodyTypes to UserPreferences")
    console.log("✅ Added marketingNotifications to UserPreferences")
    console.log("✅ Added privacy settings (profileVisible, showEmail, showPhone)")
    console.log("✅ Added theme preference")
    console.log("✅ Added language, timezone, currency settings")

    console.log("\n🚀 Next steps:")
    console.log("1. Run: npx prisma db push")
    console.log("2. Or create a migration: npx prisma migrate dev --name add-user-preferences")
    console.log("3. Generate Prisma client: npx prisma generate")
  } catch (error) {
    console.error("❌ Error updating schema:", error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePreferencesSchema()