#!/usr/bin/env node

import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.local" })

const prisma = new PrismaClient()

async function migrateSchema() {
  console.log("🔄 Running database migration...")
  console.log("=".repeat(50))

  try {
    // Run Prisma migrations
    console.log("📊 Checking database schema...")

    // Verify tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    console.log(`✅ Database connection successful`)
    console.log(`✅ Found ${(tables as any[]).length} tables`)

    // Create indices if they don't exist
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email")`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "idx_cars_isAvailable" ON "cars"("isAvailable")`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "idx_inquiries_status" ON "inquiries"("status")`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "idx_favorite_cars_userId" ON "favorite_cars"("userId")`

    console.log("✅ Indices created/verified")

    console.log("")
    console.log("✅ Migration completed successfully!")
    console.log("")
    console.log("Next steps:")
    console.log("1. Run: npx ts-node scripts/create-admin.ts")
    console.log("2. Then start your application: npm run dev")
  } catch (error) {
    console.error("❌ Migration failed:")
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateSchema()