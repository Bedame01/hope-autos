#!/usr/bin/env node

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { config } from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Load environment variables
config({ path: ".env.local" })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function createAdmin() {
  console.log("👤 Creating Admin User")
  console.log("=".repeat(50))

  const email = "admin@hopeautos.com"
  const password = "admin@123"
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
      console.log("")
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
        emailVerified: new Date(),
        preferences: {
          create: {
            emailNotifications: true,
            smsNotifications: false,
            priceAlerts: true,
            newArrivals: true,
            preferredMakes: [],
            preferredFuelTypes: [],
            theme: "light",
            language: "en",
            timezone: "UTC",
            currency: "USD",
          },
        },
      },
      include: {
        preferences: true,
      },
    })

    console.log("✅ Admin user created successfully!")
    console.log("")
    console.log("📧 Email:", email)
    console.log("🔑 Password:", password)
    console.log("🆔 User ID:", admin.id)
    console.log("")
    console.log("🔐 You can now sign in to the admin panel at /auth/signin")
    console.log("⚠️  Remember to change the password after first login!")
    console.log("")
  } catch (error) {
    console.error("❌ Error creating admin user:")
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

createAdmin()