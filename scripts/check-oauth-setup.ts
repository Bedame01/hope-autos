#!/usr/bin/env node

/**
 * OAuth Setup Diagnostic Script
 */

import { config } from "dotenv"

// Load environment variables
config({ path: ".env.local" })

function checkOAuthSetup() {
  console.log("🔍 OAuth Setup Diagnostic")
  console.log("=".repeat(40))

  const requiredVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  }

  let allGood = true

  // Check required variables
  Object.entries(requiredVars).forEach(([key, value]) => {
    const status = value ? "✅" : "❌"
    const display =
      key === "NEXTAUTH_SECRET" || key === "DATABASE_URL" || key.includes("SECRET")
        ? value
          ? "[SET]"
          : "[NOT SET]"
        : value || "[NOT SET]"

    console.log(`${status} ${key}: ${display}`)

    if (!value) allGood = false
  })

  console.log("\n📋 Validation Results:")

  // Validate NEXTAUTH_URL
  if (requiredVars.NEXTAUTH_URL) {
    try {
      const url = new URL(requiredVars.NEXTAUTH_URL)
      if (url.protocol === "http:" && !url.hostname.includes("localhost")) {
        console.log("⚠️  NEXTAUTH_URL uses HTTP in production - should use HTTPS")
      } else {
        console.log("✅ NEXTAUTH_URL format is valid")
      }
    } catch {
      console.log("❌ NEXTAUTH_URL is not a valid URL")
      allGood = false
    }
  }

  // Validate Google Client ID format
  if (requiredVars.GOOGLE_CLIENT_ID) {
    if (requiredVars.GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com")) {
      console.log("✅ Google Client ID format looks correct")
    } else {
      console.log("⚠️  Google Client ID should end with .apps.googleusercontent.com")
    }
  }

  // Check NextAuth Secret strength
  if (requiredVars.NEXTAUTH_SECRET) {
    if (requiredVars.NEXTAUTH_SECRET.length >= 32) {
      console.log("✅ NextAuth secret is sufficiently long")
    } else {
      console.log("⚠️  NextAuth secret should be at least 32 characters")
    }
  }

  console.log("\n🎯 Recommendations:")

  if (!requiredVars.GOOGLE_CLIENT_ID || !requiredVars.GOOGLE_CLIENT_SECRET) {
    console.log("• Set up Google OAuth at https://console.cloud.google.com/")
    console.log("• Add redirect URI: http://localhost:3000/api/auth/callback/google")
  }

  if (!requiredVars.NEXTAUTH_SECRET) {
    console.log("• Generate a secret: npm run generate-secret")
  }

  if (!requiredVars.DATABASE_URL) {
    console.log("• Set up database at https://neon.tech or https://supabase.com")
  }

  console.log("\n🔗 Helpful Links:")
  console.log("• Google OAuth Setup: https://console.cloud.google.com/")
  console.log("• NextAuth Docs: https://next-auth.js.org/providers/google")
  console.log("• Neon Database: https://neon.tech")

  if (allGood) {
    console.log("\n🎉 All OAuth settings look good!")
  } else {
    console.log("\n❌ Some settings need attention")
  }
}

checkOAuthSetup()
