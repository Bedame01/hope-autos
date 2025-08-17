#!/usr/bin/env node

/**
 * Create admin user script
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { config } from "dotenv"

// Load environment variables
config({ path: ".env.local" })

const prisma = new PrismaClient()

async function createAdmin() {
  console.log("👤 Creating Admin User")
  console.log("=".repeat(30))

  const email = "admin@hopeautos.com"
  const password = "admin123"
  const name = "Admin User"

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      console.log("✅ Admin user already exists")
      console.log(`📧 Email: ${email}`)
      console.log(`🔑 Password: ${password}`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        role: "ADMIN",
        password: hashedPassword,
        emailVerified: true,
        preferences: {
          create: {
            emailNotifications: true,
            smsNotifications: false,
            priceAlerts: true,
            newArrivals: true,
            preferredMakes: [],
            preferredFuelTypes: [],
          },
        },
      },
    })

    console.log("✅ Admin user created successfully!")
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`🆔 User ID: ${admin.id}`)
    console.log("")
    console.log("🔐 You can now sign in to the admin panel at /admin")
    console.log("⚠️  Remember to change the password after first login!")
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
