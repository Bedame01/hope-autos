#!/usr/bin/env node

import { config } from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: ".env.local" })

const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

const optionalEnvVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "CLOUDINARY_API_KEY", "RESEND_API_KEY"]

function validateSetup() {
  console.log("🔍 Validating setup configuration...")
  console.log("=".repeat(50))

  let hasErrors = false

  // Check required variables
  console.log("\n📋 Required Environment Variables:")
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`❌ ${envVar} - MISSING`)
      hasErrors = true
    } else {
      console.log(`✅ ${envVar} - Set`)
    }
  }

  // Check optional variables
  console.log("\n📋 Optional Environment Variables:")
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      console.log(`⚠️  ${envVar} - Not set (optional)`)
    } else {
      console.log(`✅ ${envVar} - Set`)
    }
  }

  if (hasErrors) {
    console.log("\n❌ Setup validation failed!")
    console.log("\nPlease add missing environment variables to .env.local")
    process.exit(1)
  }

  console.log("\n✅ All required variables are set!")
  console.log("\nNext steps:")
  console.log("1. Run: npx prisma migrate dev")
  console.log("2. Run: npx ts-node scripts/create-admin.ts")
  console.log("3. Start dev server: npm run dev")
}

validateSetup()