#!/usr/bin/env node

/**
 * Migration script to help transition from mock data to real database
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

async function checkTables() {
  try {
    const userCount = await prisma.user.count()
    const carCount = await prisma.car.count()
    const inquiryCount = await prisma.inquiry.count()

    console.log("📊 Database Status:")
    console.log(`   Users: ${userCount}`)
    console.log(`   Cars: ${carCount}`)
    console.log(`   Inquiries: ${inquiryCount}`)

    return { userCount, carCount, inquiryCount }
  } catch (error) {
    console.error("❌ Error checking tables:", error)
    return null
  }
}

async function main() {
  console.log("🔄 Hope Autos Database Migration Check")
  console.log("=".repeat(50))

  // Check database connection
  const connected = await checkDatabaseConnection()
  if (!connected) {
    console.log("\n📋 Setup Steps:")
    console.log("1. Create a Neon database at https://neon.tech")
    console.log("2. Add DATABASE_URL to your .env.local file")
    console.log("3. Run: npm run db:push")
    console.log("4. Run: npm run db:seed")
    return
  }

  // Check table status
  const stats = await checkTables()
  if (!stats) return

  // Provide recommendations
  console.log("\n🎯 Recommendations:")

  if (stats.userCount === 0) {
    console.log('• Run "npm run db:seed" to create sample users')
  }

  if (stats.carCount === 0) {
    console.log('• Run "npm run db:seed" to create sample cars')
  }

  if (stats.carCount > 0) {
    console.log("• Database is ready for production!")
    console.log("• You can now remove mock data from lib/db.ts")
  }

  console.log("\n🛠️  Useful Commands:")
  console.log("• npm run db:studio  - Open database GUI")
  console.log("• npm run db:seed    - Add sample data")
  console.log("• npm run db:migrate - Run migrations")

  console.log("\n✅ Migration check complete!")
}

main()
  .catch((e) => {
    console.error("❌ Migration check failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
