#!/usr/bin/env node

import { config } from "dotenv"
import { Resend } from "resend"
import { PrismaClient } from "@prisma/client"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: ".env.local" })

async function verifySetup() {
  console.log("✔️  VERIFYING SETUP")
  console.log("=".repeat(60))
  console.log("")

  // Test Database Connection
  console.log("🗄️  Testing Database Connection...")
  const prisma = new PrismaClient()

  try {
    await prisma.$queryRaw`SELECT 1`
    console.log("✅ Database connection successful")
  } catch (error) {
    console.log("❌ Database connection failed:", error)
    process.exit(1)
  }

  // Test Email Service
  console.log("")
  console.log("📧 Testing Email Service...")

  if (!process.env.RESEND_API_KEY) {
    console.log("⚠️  RESEND_API_KEY not configured")
  } else {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: "delivered@resend.dev",
        subject: "Test Email from Hope Autos",
        html: "<p>Test email sent successfully!</p>",
      })

      if (result.error) {
        console.log("❌ Email service test failed:", result.error)
      } else {
        console.log("✅ Email service working correctly")
        console.log(`   Message ID: ${result.data?.id}`)
      }
    } catch (error) {
      console.log("❌ Email service error:", error)
    }
  }

  // Test Google OAuth Config
  console.log("")
  console.log("🔐 Testing Google OAuth Configuration...")

  const hasGoogleConfig = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

  if (!hasGoogleConfig) {
    console.log("⚠️  Google OAuth not configured")
  } else {
    console.log("✅ Google OAuth credentials found")
    console.log("   Remember to add callback URL to Google Console")
  }

  // Test NextAuth Setup
  console.log("")
  console.log("🔑 Testing NextAuth Setup...")

  if (!process.env.NEXTAUTH_SECRET) {
    console.log("⚠️  NEXTAUTH_SECRET not configured")
  } else {
    console.log("✅ NEXTAUTH_SECRET is set")
  }

  if (!process.env.NEXTAUTH_URL) {
    console.log("⚠️  NEXTAUTH_URL not configured")
  } else {
    console.log("✅ NEXTAUTH_URL is set:", process.env.NEXTAUTH_URL)
  }

  console.log("")
  console.log("=".repeat(60))
  console.log("")

  await prisma.$disconnect()
}

verifySetup().catch(console.error)
